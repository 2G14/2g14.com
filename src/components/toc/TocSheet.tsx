import Toc, { type TocProps } from './Toc';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export interface TocSheetProps extends TocProps {}

export default function TocSheet({ items }: TocSheetProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger render={<Button variant="ghost">目次</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>目次</SheetTitle>
        </SheetHeader>
        <Toc items={items} onClickItem={() => setSheetOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
