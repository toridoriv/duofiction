import { JSX } from "@components/deps.ts";

export function NavbarItem(
  { children, ...props }: JSX.HTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <li class="nav-item">
      <a className="nav-link" {...props}>{children}</a>
    </li>
  );
}

export function Navbar(props: JSX.HTMLAttributes<HTMLAnchorElement>[]) {
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
          {props.map(NavbarItem)}
        </ul>
      </div>
    </nav>
  );
}

export interface NavPaginationItemProps {
  isActive?: boolean;
  href: string;
  page: number | string;
}

export function NavPaginationItem(
  { isActive, href, page }: NavPaginationItemProps,
) {
  const props: JSX.HTMLAttributes<HTMLLIElement> = {
    class: "page-item",
  };

  if (isActive) {
    props.class = `${props.class} active`;
    props["aria-current"] = "page";
  }

  return (
    <li {...props}>
      <a class="page-link" href={href}>{page}</a>
    </li>
  );
}

enum NavPaginationArrowDirection {
  PREVIOUS = "Previous",
  NEXT = "Next",
}

const NavPaginationArrowIcon = {
  [NavPaginationArrowDirection.PREVIOUS]: "fa-solid fa-angle-left",
  [NavPaginationArrowDirection.NEXT]: "fa-solid fa-angle-right",
};

export interface NavPaginationArrowProps {
  isEnabled?: boolean;
  href: string;
  direction: NavPaginationArrowDirection;
}

export function NavPaginationArrow(
  { isEnabled, href, direction }: NavPaginationArrowProps,
) {
  const props: JSX.HTMLAttributes<HTMLLIElement> = {
    class: "page-item",
  };
  const anchorProps: JSX.HTMLAttributes<HTMLAnchorElement> = {
    href,
  };

  if (!isEnabled) {
    props.class = `${props.class} disabled`;
    anchorProps.style = "pointer-events: none";
  }

  return (
    <li {...props}>
      <a class="page-link" aria-label={direction} {...anchorProps}>
        <i class={NavPaginationArrowIcon[direction]}>
        </i>
      </a>
    </li>
  );
}

export interface NavPaginationProps extends JSX.HTMLAttributes<HTMLElement> {
  "aria-label": string;
  pageTemplate: `${string}/:page`;
  pagesProps: NavPaginationItemProps[];
  currentPage: number;
  lastPage: number;
}

export function NavPagination(
  { pageTemplate, pagesProps, currentPage, lastPage, ...props }:
    NavPaginationProps,
) {
  return (
    <nav {...props}>
      <ul class="pagination">
        {NavPaginationArrow({
          isEnabled: currentPage !== 1,
          href: pageTemplate.replace(":page", `${currentPage - 1}`),
          direction: NavPaginationArrowDirection.PREVIOUS,
        })}
        {pagesProps.map(NavPaginationItem)}
        {NavPaginationArrow({
          isEnabled: lastPage !== currentPage,
          href: pageTemplate.replace(":page", `${currentPage + 1}`),
          direction: NavPaginationArrowDirection.NEXT,
        })}
      </ul>
    </nav>
  );
}
