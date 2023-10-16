import { JSX } from "./deps.ts";

export function NavItem(
  { children, ...props }: JSX.HTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <li class="nav-item">
      <a className="nav-link" {...props}>{children}</a>
    </li>
  );
}

export function Nav(props: JSX.HTMLAttributes<HTMLAnchorElement>[]) {
  return (
    <nav
      class="navbar navbar-expand-lg"
      style="background-color: var(--bs-content-bg)"
    >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbar-collapse-7"
        aria-controls="navbar-collapse-7"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbar-collapse-7">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          {props.map(NavItem)}
        </ul>
      </div>
    </nav>
  );
}
