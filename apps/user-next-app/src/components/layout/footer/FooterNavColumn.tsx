import Link from 'next/link';
import { FooterNavLink } from '@/constants/footer';

export const footerLinkClass = "block text-[14px] text-white font-normal no-underline mb-2.5 leading-[1.4] transition-colors duration-200 hover:text-[#ff5901]";
export const footerHeadingClass = "text-[16px] font-bold text-[#ff5901] no-underline block mb-4 leading-[1.3] hover:text-[#ff5901]";

interface FooterNavGroup {
  heading: string;
  headingHref: string;
  links: FooterNavLink[];
}

interface FooterNavColumnProps {
  groups: FooterNavGroup[];
}

export const FooterNavColumn = ({ groups }: FooterNavColumnProps) => {
  return (
    <div>
      {groups.map((group, gi) => (
        <div key={gi} className={gi < groups.length - 1 ? 'mb-7' : 'mb-0'}>
          <Link href={group.headingHref} className={footerHeadingClass}>
            {group.heading}
          </Link>
          <ul className="list-none m-0 p-0">
            {group.links.map((link) => {
              const indentClass = link.indent ? 'pl-3 text-[13px] text-[#aaa]' : 'pl-0 text-[14px] text-white';
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${footerLinkClass} ${indentClass}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
