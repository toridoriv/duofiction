import { JSX } from "@components/deps.ts";

export interface TagButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  icon: string;
  name: string;
  value: string;
  href: string;
}

export function TagButton({ icon, name, value, ...props }: TagButtonProps) {
  const iconClass = `fa-solid fa-${icon}`;
  return (
    <a
      class="btn btn-secondary position-relative tag"
      role="button"
      {...props}
    >
      <i class={iconClass}></i> {name}:{value}
    </a>
  );
}

export interface TagButtonCounterProps extends TagButtonProps {
  total: number;
}

export function TagButtonCounter(
  { icon, name, value, total, ...props }: TagButtonCounterProps,
) {
  const iconClass = `fa-solid fa-${icon}`;
  return (
    <a
      class="btn btn-secondary position-relative tag counter"
      role="button"
      {...props}
    >
      <i class={iconClass}></i> {name}:{value}
      <span class="badge position-absolute top-0 start-100 translate-middle text-bg-success">
        {total}
      </span>
    </a>
  );
}
