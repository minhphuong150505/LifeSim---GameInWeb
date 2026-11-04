import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

type Point = { x: number; y: number };

/**
 * An item the player drags with a finger/mouse and drops on a target.
 *
 * The whole game is scaled with a CSS transform (GameScale), so framer-motion's drag (which
 * moves the element by raw screen pixels) drifted away from the finger and the drop point did
 * not match what the player saw. Here the item follows the pointer exactly: screen deltas are
 * divided by the frame scale, and the drop test uses the item's centre on screen.
 */
export function DragItem({
  children,
  label,
  className,
  isOverTarget,
  onDrop,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  /** Screen-space hit test for the item's centre (viewport pixels). */
  isOverTarget: (center: Point) => boolean;
  onDrop: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number; scale: number } | null>(null);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hot, setHot] = useState(false);

  const centre = (): Point | null => {
    const r = ref.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
  };

  return (
    <motion.div
      ref={ref}
      role="img"
      aria-label={label}
      initial={{ scale: 0 }}
      animate={{ scale: dragging ? 1.15 : 1 }}
      className={className}
      style={{
        translate: `${offset.x}px ${offset.y}px`,
        transition: dragging ? 'none' : 'translate 0.25s ease-out',
        touchAction: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
        filter: hot ? 'drop-shadow(0 0 10px #ffd23f)' : undefined,
      }}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        // Ratio between screen pixels and design pixels (the GameScale transform).
        const scale = el.getBoundingClientRect().width / (el.offsetWidth || 1) || 1;
        start.current = { x: e.clientX - offset.x * scale, y: e.clientY - offset.y * scale, scale };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        const s = start.current;
        if (!s) return;
        setOffset({ x: (e.clientX - s.x) / s.scale, y: (e.clientY - s.y) / s.scale });
        const c = centre();
        setHot(Boolean(c && isOverTarget(c)));
      }}
      onPointerUp={() => {
        if (!start.current) return;
        start.current = null;
        setDragging(false);
        setHot(false);
        const c = centre();
        if (c && isOverTarget(c)) onDrop();
        else setOffset({ x: 0, y: 0 });
      }}
      onPointerCancel={() => {
        start.current = null;
        setDragging(false);
        setHot(false);
        setOffset({ x: 0, y: 0 });
      }}
    >
      {children}
    </motion.div>
  );
}
