import Toc, { type TocProps } from './Toc';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export interface TocSheetProps extends TocProps {}

export default function TocSheet({ items }: TocSheetProps) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">目次</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>目次</SheetTitle>
        </SheetHeader>
        <Toc items={items} />
      </SheetContent>
    </Sheet>
  );
}
