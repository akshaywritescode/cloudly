import React from 'react';
import SidebarItem, { SidebarItemProps } from './SidebarItem';
import CreateFolderButton from './CreateFolderButton';

export interface SidebarSectionProps {
  title: string;
  items: SidebarItemProps[];
}

export default function SidebarSection({ title, items }: SidebarSectionProps) {
  return (
    <div className="px-4 mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItem key={item.id} {...item} />
        ))}
        {title === "Folders" && (
          <CreateFolderButton onClick={() => console.log('Create folder clicked')} />
        )}
      </div>
    </div>
  );
}
