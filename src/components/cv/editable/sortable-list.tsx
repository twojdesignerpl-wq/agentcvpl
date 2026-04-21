"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SortableListProps = {
  ids: string[];
  onReorder: (ids: string[]) => void;
  children: ReactNode;
};

export function SortableList({ ids, onReorder, children }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(String(active.id));
    const newIdx = ids.indexOf(String(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    onReorder(arrayMove(ids, oldIdx, newIdx));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function useSortableRow(id: string): {
  rowRef: (node: HTMLElement | null) => void;
  rowStyle: CSSProperties;
  handleProps: Record<string, unknown>;
  isDragging: boolean;
} {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  return {
    rowRef: setNodeRef,
    rowStyle: {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.55 : undefined,
      zIndex: isDragging ? 50 : undefined,
      position: isDragging ? "relative" : undefined,
    },
    handleProps: { ...attributes, ...listeners },
    isDragging,
  };
}

type SortableHandleProps = {
  className?: string;
  handleProps: Record<string, unknown>;
  label?: string;
};

export function SortableHandle({
  className,
  handleProps,
  label = "Przeciągnij aby zmienić kolejność",
}: SortableHandleProps) {
  return (
    <button
      type="button"
      {...handleProps}
      aria-label={label}
      tabIndex={-1}
      className={cn(
        "shrink-0 cursor-grab touch-none rounded text-[color:var(--cv-muted-soft)] opacity-0 transition-opacity duration-200 ease-out",
        "group-hover:opacity-70 hover:!opacity-100 active:cursor-grabbing",
        "focus-visible:outline-none focus-visible:opacity-100",
        className,
      )}
    >
      <DotsSixVertical size={12} weight="bold" />
    </button>
  );
}
