'use client';
import { Switch } from '@tremor/react';
import { useEffect, useState } from 'react';

export default function ThemeSwich() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      setIsSwitchOn(true);
    } else if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      setIsSwitchOn(false);
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      setIsSwitchOn(false);
    }
  }, []);

  const handleSwitchChange = (value) => {
    setIsSwitchOn(value);
    if (value) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  return (
    <div>
      <Switch
        name='theme swich'
        label='theme swich'
        checked={isSwitchOn}
        onChange={handleSwitchChange}
      />
    </div>
  );
}
