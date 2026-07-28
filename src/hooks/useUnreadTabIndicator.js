import { useEffect, useRef } from 'react';
import {
  setFaviconBadge,
  clearFaviconBadge,
} from "../services/faviconService";

/**
 * useUnreadTabIndicator
 *
 * While unreadCount > 0, prefixes the document title with "(n)" and draws a
 * badge on the favicon. Restores both the moment the count returns to 0 or
 * the component unmounts.
 *
 * @param {number} unreadCount
 */
export default function useUnreadTabIndicator(unreadCount) {
  const originalTitleRef = useRef(document.title);

  useEffect(() => {
    const originalTitle = originalTitleRef.current;

    if (unreadCount > 0) {
      document.title = `(${unreadCount > 9 ? '9+' : unreadCount}) ${originalTitle}`;
      setFaviconBadge(unreadCount);
    } else {
      document.title = originalTitle;
      clearFaviconBadge();
    }
  }, [unreadCount]);

  useEffect(() => {
    const originalTitle = originalTitleRef.current;
    return () => {
      document.title = originalTitle;
      clearFaviconBadge();
    };
  }, []);
}