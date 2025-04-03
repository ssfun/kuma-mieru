'use client';

import { locales, type Locale } from '@/utils/i18n/config';
import { setUserLocale } from '@/utils/i18n/locale';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from '@heroui/react';
import { Languages, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

export const I18NSwitch = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();

  const handleLocaleChange = (locale: Locale, localeName: string) => {
    startTransition(async () => {
      try {
        await toast.promise(
          async () => {
            await setUserLocale(locale);
            // 我们需要刷新页面以应用新的语言设置
            window.location.reload();
          },
          {
            loading: t('localeChanging', { locale: localeName }),
            success: t('localeChanged', { locale: localeName }),
            error: (err) => `${t('localeChangeError')}: ${err.message || t('errorUnknown')}`,
          }
        );
      } catch (error) {
        console.error('Failed to change locale:', error);
      }
    });
  };

  return (
    <Dropdown aria-label="Switch Language">
      <DropdownTrigger>
        <Button variant="light" isIconOnly className="text-default-500">
          {isPending ? (
            <Loader2 size={22} className="animate-spin [animation-duration:0.3s]" />
          ) : (
            <Languages size={22} />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Switch Language" variant="faded">
        {locales.map((item) => (
          <DropdownItem
            key={item.key}
            onPress={() => handleLocaleChange(item.key, item.name)}
            className="flex flex-row items-center gap-2 text-default-500"
            startContent={
              <Image
                src={`https://fastly.jsdelivr.net/gh/HatScripts/circle-flags@2.7.0/flags/${item.alpha2Code.toLowerCase()}.svg`}
                alt={item.flag}
                width={24}
                height={24}
                className="w-6 h-6"
                loading="lazy"
              />
            }
          >
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
