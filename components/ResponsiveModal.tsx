import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface Props {
	open: boolean;
	closeModal?: () => void;
	children: React.ReactNode;
}

export const ResponsiveModal = ({ open, children, closeModal }: Props) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (!open) return null;

	return isDesktop ? (
		<Dialog
			open={open}
			onOpenChange={() => {
				if (!open) {
					closeModal;
				} else {
					closeModal;
				}
			}}
		>
			<DialogContent className="sm:max-w-xl max-h-[550px] overflow-hidden flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] [&>button:last-child]:hidden">
				{children}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open={open} onOpenChange={closeModal}>
			<DrawerContent className="h-[85vh]">
				<ScrollArea className="h-[85vh]">{children}</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
};
