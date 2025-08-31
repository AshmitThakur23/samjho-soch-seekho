import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VoiceSetupDialogProps {
  isOpen: boolean;
  onComplete: (enableVoice: boolean, language?: string) => void;
}

export const VoiceSetupDialog = ({ isOpen, onComplete }: VoiceSetupDialogProps) => {
  const [step, setStep] = useState<'voice' | 'language'>('voice');
  const [wantsVoice, setWantsVoice] = useState<boolean>(false);

  const handleVoiceChoice = (choice: boolean) => {
    setWantsVoice(choice);
    if (choice) {
      setStep('language');
    } else {
      onComplete(false);
      setStep('voice'); // Reset for next time
    }
  };

  const handleLanguageChoice = (language: string) => {
    onComplete(true, language);
    setStep('voice'); // Reset for next time
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {step === 'voice' ? 'Voice Mode' : 'Language Preference'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {step === 'voice' ? (
            <>
              <p className="text-center text-muted-foreground">
                Do you want to use Voice Mode to listen to the document summary?
              </p>
              <div className="flex space-x-4 justify-center">
                <Button 
                  onClick={() => handleVoiceChoice(true)}
                  className="flex-1"
                >
                  Yes, Enable Voice
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleVoiceChoice(false)}
                  className="flex-1"
                >
                  No, Text Only
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                Which language would you prefer for listening?
              </p>
              <div className="flex space-x-4 justify-center">
                <Button 
                  onClick={() => handleLanguageChoice('EN')}
                  className="flex-1"
                >
                  English
                </Button>
                <Button 
                  onClick={() => handleLanguageChoice('HI')}
                  className="flex-1"
                >
                  Hindi / हिंदी
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};