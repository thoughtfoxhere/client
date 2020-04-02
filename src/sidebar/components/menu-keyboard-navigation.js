import { createElement } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import propTypes from 'prop-types';

function isElementVisible(element) {
  return element.offsetParent !== null;
}

/**
 * Menu wrapper component to facilitate keyboard navigation of a list of
 * <MenuItem> components.
 *
 * Note that `ArrowRight` shall be handled by the <MenuItem> directly and
 * all other focus() related  navigation is handled here.
 */
export default function MenuKeyboardNavigation({
  className,
  closeMenu,
  children,
  isVisible,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        const firstItem = menuRef.current.querySelector('[role^="menuitem"]');
        if (firstItem) {
          firstItem.focus();
        }
      });
      // TODO: figure out something better than this timeout hack
      // The focus won't work without delaying rendering
    }
  }, [isVisible]);

  const onKeyDown = event => {
    const menuItems = Array.from(
      menuRef.current.querySelectorAll('[role^="menuitem"]')
    ).filter(isElementVisible);

    let focusedIndex = menuItems.findIndex(el =>
      el.contains(document.activeElement)
    );

    let handled = false;

    switch (event.key) {
      case 'ArrowLeft':
      case 'Esc':
        if (closeMenu) {
          closeMenu(event);
          handled = true;
        }
        break;
      case 'ArrowUp':
        focusedIndex -= 1;
        if (focusedIndex < 0) {
          focusedIndex = menuItems.length - 1;
        }
        handled = true;
        break;
      case 'ArrowDown':
        focusedIndex += 1;
        if (focusedIndex === menuItems.length) {
          focusedIndex = 0;
        }
        handled = true;
        break;
      case 'Home':
        focusedIndex = 0;
        handled = true;
        break;
      case 'End':
        focusedIndex = menuItems.length - 1;
        handled = true;
        break;
    }

    if (handled && focusedIndex >= 0) {
      event.stopPropagation();
      event.preventDefault();
      menuItems[focusedIndex].focus();
    }
  };

  return (
    <div role="none" className={className} ref={menuRef} onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}

MenuKeyboardNavigation.propTypes = {
  className: propTypes.string,
  closeMenu: propTypes.func,
  isVisible: propTypes.bool,
  children: propTypes.any,
};
