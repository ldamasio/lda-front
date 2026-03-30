'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Image from 'next/image';

const languages = [
  { value: 'en', label: 'English', flag: 'gb' },
  { value: 'de', label: 'Deutsch', flag: 'de' },
  { value: 'fr', label: 'Français', flag: 'fr' },
  { value: 'it', label: 'Italiano', flag: 'it' },
  { value: 'es', label: 'Español', flag: 'es' },
  { value: 'pt', label: 'Português', flag: 'pt' },
  { value: 'zh', label: '中文', flag: 'cn' },
];

const LanguageSelect = ({ currentPath }) => {
  const router = useRouter();
  const currentLanguageCode = currentPath?.split('/')[1] || 'en';

  const handleChange = (value) => {
    // Substitui o código da linguagem na URL atual
    const segments = currentPath ? currentPath.split('/') : ['', 'en'];
    if (segments.length > 1) {
      segments[1] = value;
      const newPath = segments.join('/') || '/';
      router.push(newPath);
    } else {
      router.push(`/${value}`);
    }
  };

  return (
    <div className='md:ml-4 w-full md:w-auto'>
      <Select
        value={currentLanguageCode}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue className="flex items-center gap-2" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              <div className="flex items-center gap-2">
                <Image 
                  src={`https://flagcdn.com/w20/${language.flag}.png`}
                  width={20}
                  height={15}
                  className="rounded-sm object-contain"
                  alt={`${language.label} flag`} 
                />
                <span>{language.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelect;