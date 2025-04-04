-- Adminer 5.1.0 PostgreSQL 15.8 dump

DROP FUNCTION IF EXISTS "create_user_on_signup";;
CREATE FUNCTION "create_user_on_signup" () RETURNS trigger LANGUAGE plpgsql AS 'begin 

  insert into public.profiles(id,email,name,image_url)
  values(
    new.id,
    new.email,
    COALESCE(NEW.raw_user_meta_data ->> ''name'', ''Room8''),
    COALESCE(NEW.raw_user_meta_data ->> ''avatar_url'', ''https://lh3.googleusercontent.com/a/ACg8ocIvR2DkQkn6JzD9P7FFX_8zavr5UpDyKyqPTyVET3DohSuQ3No=s96-c'')
  );

  return new;

end';

DROP FUNCTION IF EXISTS "get_outstanding_loans_summary_for_user";;
CREATE FUNCTION "get_outstanding_loans_summary_for_user" (IN "user_id_param" uuid, IN "result_offset" integer, OUT "bill_id" uuid, OUT "bill_name" text, OUT "sum_paid_back" double precision, OUT "total_owed" double precision) RETURNS record LANGUAGE sql AS '
    SELECT 
        bill_id,
        bill_name,
        sum_paid_back,
        total_owed
    FROM (
        SELECT 
            bill_id,
            bill_name, 
            SUM(CASE WHEN paid = true THEN amount_owed ELSE 0 END) AS sum_paid_back, 
            SUM(amount_owed) AS total_owed
        FROM 
            amounts_owed
        WHERE 
            loaner_id = user_id_param
        GROUP BY 
            bill_id, bill_name
    ) subquery
    WHERE 
        sum_paid_back < total_owed
    ORDER BY 
        sum_paid_back ASC
    OFFSET result_offset;
';

CREATE TABLE "amounts_owed" ("bill_id" uuid, "bill_name" text, "owed_by" date, "owe_id" uuid, "loaner_name" text, "loaner_id" uuid, "debtor_name" text, "debtor_id" uuid, "bill_total" real, "amount_owed" real, "paid" boolean, "created_at" timestamptz, "updated_at" timestamp);


CREATE TABLE "public"."bill_presets" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "house_id" uuid NOT NULL,
    "name" text NOT NULL,
    "amount" real NOT NULL,
    "owed_by" date,
    "owes" json,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "bill_presets_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."bills" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text DEFAULT '' NOT NULL,
    "total" real DEFAULT '0' NOT NULL,
    "owed_by" date,
    "loaner_id" uuid NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON TABLE "public"."bills" IS 'List of bill totals for bill splitting module.';


DELIMITER ;;

CREATE TRIGGER "bills_updated_at" AFTER UPDATE ON "public"."bills" FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();;

DELIMITER ;

CREATE TABLE "public"."chores" (
    "id" bigint DEFAULT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "time" text NOT NULL,
    "house_id" uuid NOT NULL,
    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."chores_completed" (
    "id" bigint DEFAULT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "responsible_id" bigint NOT NULL,
    CONSTRAINT "chores_completed_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."cleanliness_logs" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "camera_id" uuid NOT NULL,
    "before_image_url" text NOT NULL,
    "after_image_url" text NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "cleanliness_log_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."cleanliness_tasks" (
    "id" bigint DEFAULT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "cl_log_id" uuid NOT NULL,
    "assigned_to_id" uuid,
    "assigned_by_id" uuid,
    "status" text DEFAULT 'unassigned' NOT NULL,
    "name" text NOT NULL,
    "completed_by_id" uuid,
    "completed_at" timestamptz,
    CONSTRAINT "cleanliness_tasks_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."house_invites" (
    "id" bigint DEFAULT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "house_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "inviter_id" uuid NOT NULL,
    CONSTRAINT "house_invites_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."houses" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "address" text NOT NULL,
    "owner" uuid NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "name" text DEFAULT 'My House' NOT NULL,
    "chatbot_active" boolean DEFAULT false NOT NULL,
    "camera_id" uuid,
    CONSTRAINT "houses_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE UNIQUE INDEX houses_address_key ON public.houses USING btree (address);

CREATE UNIQUE INDEX houses_camera_id_key ON public.houses USING btree (camera_id);


DELIMITER ;;

CREATE TRIGGER "houses_updated_at" AFTER UPDATE ON "public"."houses" FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();;

DELIMITER ;

CREATE TABLE "public"."notes" (
    "id" bigint DEFAULT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "text" text NOT NULL,
    "poster_id" uuid NOT NULL,
    "favourited" boolean DEFAULT false NOT NULL,
    "house_id" uuid NOT NULL,
    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."owes" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "bill_id" uuid NOT NULL,
    "amount" real NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "debtor_id" uuid NOT NULL,
    "paid" boolean DEFAULT false NOT NULL,
    CONSTRAINT "owes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON TABLE "public"."owes" IS 'Contains how much a person owes to a bill from "bills"';


DELIMITER ;;

CREATE TRIGGER "owes_updated_at" AFTER UPDATE ON "public"."owes" FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();;

DELIMITER ;

CREATE TABLE "public"."profiles" (
    "id" uuid DEFAULT auth.uid() NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "email" text NOT NULL,
    "name" text DEFAULT 'room8' NOT NULL,
    "image_url" text NOT NULL,
    "house_id" uuid,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "phone" text DEFAULT 'NULL',
    CONSTRAINT "public_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DELIMITER ;;

CREATE TRIGGER "profiles_updated_at" AFTER UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();;

DELIMITER ;

CREATE TABLE "public"."responsible" (
    "id" bigint DEFAULT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "activity_id" bigint,
    "profile_id" uuid,
    CONSTRAINT "responsible_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."bills" ADD CONSTRAINT "bills_loaner_id_fkey" FOREIGN KEY (loaner_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."chores" ADD CONSTRAINT "activities_house_id_fkey" FOREIGN KEY (house_id) REFERENCES houses(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."chores_completed" ADD CONSTRAINT "chores_completed_responsible_id_fkey" FOREIGN KEY (responsible_id) REFERENCES responsible(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."cleanliness_logs" ADD CONSTRAINT "cleanliness_logs_camera_id_fkey" FOREIGN KEY (camera_id) REFERENCES houses(camera_id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."cleanliness_tasks" ADD CONSTRAINT "cleanliness_tasks_assigned_by_id_fkey" FOREIGN KEY (assigned_by_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."cleanliness_tasks" ADD CONSTRAINT "cleanliness_tasks_assigned_to_id_fkey" FOREIGN KEY (assigned_to_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."cleanliness_tasks" ADD CONSTRAINT "cleanliness_tasks_cl_log_id_fkey" FOREIGN KEY (cl_log_id) REFERENCES cleanliness_logs(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."cleanliness_tasks" ADD CONSTRAINT "cleanliness_tasks_completed_by_id_fkey" FOREIGN KEY (completed_by_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."house_invites" ADD CONSTRAINT "house_invites_house_id_fkey" FOREIGN KEY (house_id) REFERENCES houses(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."house_invites" ADD CONSTRAINT "house_invites_inviter_id_fkey" FOREIGN KEY (inviter_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."house_invites" ADD CONSTRAINT "house_invites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."houses" ADD CONSTRAINT "houses_owner_fkey" FOREIGN KEY (owner) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."notes" ADD CONSTRAINT "notes_house_id_fkey" FOREIGN KEY (house_id) REFERENCES houses(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."notes" ADD CONSTRAINT "notes_poster_id_fkey" FOREIGN KEY (poster_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."owes" ADD CONSTRAINT "owes_bill_id_fkey" FOREIGN KEY (bill_id) REFERENCES bills(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."owes" ADD CONSTRAINT "owes_debtor_id_fkey" FOREIGN KEY (debtor_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."profiles" ADD CONSTRAINT "profiles_house_id_fkey" FOREIGN KEY (house_id) REFERENCES houses(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;
ALTER TABLE ONLY "public"."profiles" ADD CONSTRAINT "public_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."responsible" ADD CONSTRAINT "responsible_activity_id_fkey" FOREIGN KEY (activity_id) REFERENCES chores(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."responsible" ADD CONSTRAINT "responsible_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) NOT DEFERRABLE;

DROP TABLE IF EXISTS "amounts_owed";
CREATE VIEW "amounts_owed" AS SELECT b.id AS bill_id,
    b.name AS bill_name,
    b.owed_by,
    o.id AS owe_id,
    loaner.name AS loaner_name,
    loaner.id AS loaner_id,
    debtor.name AS debtor_name,
    debtor.id AS debtor_id,
    b.total AS bill_total,
    o.amount AS amount_owed,
    o.paid,
    o.created_at,
    o.updated_at
   FROM (((bills b
     JOIN owes o ON ((o.bill_id = b.id)))
     JOIN profiles debtor ON ((debtor.id = o.debtor_id)))
     JOIN profiles loaner ON ((loaner.id = b.loaner_id)));

-- 2025-04-04 22:49:51 UTC
