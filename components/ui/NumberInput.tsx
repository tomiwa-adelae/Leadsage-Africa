"use client";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Group, Label, NumberField } from "react-aria-components";
import { Button } from "./button";
import { Input } from "./input";

export const NumberInput = ({ field }: { field: any }) => {
	return (
		<NumberField defaultValue={field.value} minValue={field.value}>
			<div className="*:not-first:mt-2">
				<Group className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-11 w-full items-center overflow-hidden rounded-md border whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:ring-[3px]">
					<Button
						type="button"
						slot="decrement"
						disabled={field.value === 0}
						variant={"outline"}
						onClick={() =>
							field.value !== 0 && field.onChange(field.value - 1)
						}
					>
						<MinusIcon size={16} aria-hidden="true" />
					</Button>
					<Input
						value={field.value}
						onChange={(value) => field.onChange(value)}
						className="bg-background text-foreground w-full grow text-center tabular-nums"
					/>
					<Button
						type="button"
						variant={"outline"}
						slot="increment"
						onClick={() => field.onChange(field.value + 1)}
					>
						<PlusIcon size={16} aria-hidden="true" />
					</Button>
				</Group>
			</div>
		</NumberField>
	);
};
