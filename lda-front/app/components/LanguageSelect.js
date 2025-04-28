'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const languages = [
  { value: 'en', label: 'English', icon: '🇬🇧' },
  { value: 'de', label: 'Deutsch', icon: '🇩🇪' },
  { value: 'fr', label: 'Français', icon: '🇫🇷' },
  { value: 'it', label: 'Italiano', icon: '🇮🇹' },
  { value: 'es', label: 'Español', icon: '🇪🇸' },
  { value: 'pt', label: 'Português', icon: '🇵🇹' },
  { value: 'zh', label: '中文', icon: '🇨🇳' },
];

const LanguageSelect = ({ currentPath }) => {
  const router = useRouter();
  const pathname = currentPath;

  const handleChange = (event) => {
    // Substitui o código da linguagem na URL atual
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = event;
      const newPath = segments.join('/') || '/';
      router.push(newPath);
    } else {
      router.push(`/${event}`);
    }
  };

  const currentLanguage = pathname?.split('/')[1] || 'en';

  return (
    <div>
      <Select
        value={currentLanguage}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.icon} {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelect;