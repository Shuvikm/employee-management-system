import { useEffect, useCallback } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Map of key combos to handlers
 * @param {Object} options - Options like enabled, target element
 */
export default function useKeyboardShortcuts(shortcuts, { enabled = true, node } = {}) {
  const handler = useCallback((e) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = e.target;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) {
      // Allow Escape in inputs
      if (e.key !== 'Escape') return;
    }

    // Build key combo string
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    parts.push(e.key);

    const combo = parts.join('+');

    const shortcut = shortcuts[combo];
    if (shortcut) {
      e.preventDefault();
      e.stopPropagation();
      shortcut(e);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    const el = node || document;
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [handler, node]);
}
