import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Sparkles, Loader2 } from "lucide-react";

const AIPromptDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  description, 
  placeholder,
  isLoading = false,
  submitButtonText = "Generate"
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleClose = () => {
    setPrompt('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Your Input</Label>
            <Textarea
              id="prompt"
              placeholder={placeholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {submitButtonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIPromptDialog;