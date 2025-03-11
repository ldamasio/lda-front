'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

const LanguageSelect = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event) => {
    // console.log(event);
    router.push(`/${event}`);
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