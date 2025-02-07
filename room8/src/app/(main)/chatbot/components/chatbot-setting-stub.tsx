import { cn } from '@/lib/utils';
import { TSettingKeys } from '../page';

type props = {
  name: string;
  id: TSettingKeys;
  isSelected: boolean;
  description: string;
  handleToggleSetting: (id: TSettingKeys) => void;
};

function ChatBotSettingsStub({ name, description, id, isSelected, handleToggleSetting }: props) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="basis-[60%]">
        <p>{name}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div
        onClick={() => {
          handleToggleSetting(id);
        }}
        className="cursor-pointer h-14 w-48 border rounded-md flex items-center justify-center gap-2">
        <div
          className={cn(
            'h-10 w-[84px] rounded-sm grid place-content-center transition-all',
            !isSelected && 'bg-primary'
          )}>
          <p className={cn('transition-all text-lg tracking-widest', !isSelected && 'font-bold')}>
            OFF
          </p>
        </div>
        <div
          className={cn(
            'h-10 w-[84px] rounded-sm grid place-content-center transition-all',
            isSelected && 'bg-primary'
          )}>
          <p className={cn('transition-all text-lg tracking-widest', isSelected && 'font-bold')}>
            ON
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatBotSettingsStub;
