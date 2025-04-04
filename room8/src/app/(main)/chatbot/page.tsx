'use client';

import LoadingSpinner from '@/components/loading';
import RoommatesTable from '@/components/roommates-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import UserGuideModal from '@/components/user-guide-modal';
import useGetHouse from '@/hooks/useGetHouse';
import { USER_GUIDE } from '@/lib/constants/user-guide';
import { useState } from 'react';
import ChatBotSettingsStub from './components/chatbot-setting-stub';
import useActivateChatbot from './hooks/useActivateChatbot';

export type TSettingKeys =
  | 'roommate-updates'
  | 'bill-updates'
  | 'house-updates'
  | 'notes'
  | 'cleanliness'
  | 'commands'
  | 'chores';

type TChatBotSettings = {
  [key in TSettingKeys]: {
    label: string;
    description: string;
    selected: boolean;
  };
};

export default function ChatBotPage() {
  const activate = useActivateChatbot();
  const [settings, setSettings] = useState<TChatBotSettings>({
    'house-updates': {
      label: 'House Updates',
      selected: false,
      description: 'Receive notifications for updates on house setting updates'
    },
    'roommate-updates': {
      label: 'Roommate Updates',
      selected: false,
      description: 'Receive notifications on new roommates, roommate removals, and roommate updates'
    },
    notes: {
      label: 'Notes',
      selected: false,
      description: 'Receive notifications for notes your roommates leave'
    },
    cleanliness: {
      label: 'Cleanliness Manager Updates',
      selected: false,
      description: 'Receive notifications for cleanliness updates and cleanliness reminders'
    },
    'bill-updates': {
      label: 'Bills',
      selected: false,
      description: 'Receive notifications for new bills, outstanding bills, and bill deadlines'
    },
    chores: {
      label: 'Chores',
      selected: false,
      description: 'Receive notifications for chore assignments, upcoming chores, and updates'
    },
    commands: {
      label: 'Commands',
      selected: false,
      description: 'Enable commands for the chatbot such as /help'
    }
  });
  const { data: house, isLoading: houseLoading, isError: houseError } = useGetHouse();
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  function handleToggleSetting(id: TSettingKeys) {
    setSettings((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected }
    }));
  }

  return (
    <div>
      <h2 className="text-4xl mb-8">ChatBot Integration</h2>
      <div className="w-[40vw] flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle>
              Activate ChatBot <UserGuideModal data={USER_GUIDE.CHATBOT} />
            </CardTitle>
            <CardDescription>
              This ChatBot will send all the following roommates SMS notifcations regarding the
              state of the household
            </CardDescription>
          </CardHeader>
          <CardContent>
            {houseLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <h3 className="text-xl">Roommates</h3>
                <RoommatesTable hideFooter remove={false} />
                <div className="mt-6">
                  {house?.chatbotActive ? (
                    <>
                      <h3 className="text-xl">ChatBot Settings</h3>
                      {Object.entries(settings).map(([key, { label, selected }]) => (
                        <ChatBotSettingsStub
                          key={key}
                          name={label}
                          description={settings[key as TSettingKeys].description}
                          id={key as TSettingKeys}
                          isSelected={selected}
                          handleToggleSetting={handleToggleSetting}
                        />
                      ))}
                      <Button className="mt-4 w-full" onClick={() => {}}>
                        Update ChatBot Settings
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="mt-4 w-full"
                      onClick={() => {
                        activate.mutate();
                        setUnsavedChanges(true);
                      }}
                      disabled={unsavedChanges}>
                      {!unsavedChanges ? 'Activate ChatBot' : 'Chatbot Pending'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
