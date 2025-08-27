(function() {
  // Only run in iframe (dashboard preview)
  if (window.self === window.top) return;
  
  const logs = [];
  const MAX_LOGS = 500;
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Helper function to serialize arguments
  function serializeArgs(args) {
    return Array.from(args).map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');
  }
  
  // Capture console logs
  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = serializeArgs(args);
    
    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };
    
    // Store log
    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
    
    // Send to parent
    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) {
      // Silently fail if postMessage fails
    }
    
    // Call original console method
    originalConsole[level].apply(console, args);
  }
  
  // Override console methods
  console.log = function() { captureLog('log', arguments); };
  console.warn = function() { captureLog('warn', arguments); };
  console.error = function() { captureLog('error', arguments); };
  console.info = function() { captureLog('info', arguments); };
  console.debug = function() { captureLog('debug', arguments); };
  
  // Capture unhandled errors
  window.addEventListener('error', function(event) {
    captureLog('error', [`Unhandled Error: ${event.error?.message || event.message}`, event.error]);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    captureLog('error', [`Unhandled Promise Rejection: ${event.reason}`]);
  });
  
  // Send ready message
  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {
      // Silently fail if postMessage fails
    }
  }
  
  // Send route change message
  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {
      // Silently fail if postMessage fails
    }
  }
  
  // Send ready message when loaded
  if (document.readyState === 'complete') {
    sendReady();
    sendRouteChange();
  } else {
    window.addEventListener('load', function() {
      sendReady();
      sendRouteChange();
    });
  }
  
  // Monitor for route changes (SPA navigation)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(sendRouteChange, 0);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(sendRouteChange, 0);
  };
  
  window.addEventListener('popstate', sendRouteChange);
  window.addEventListener('hashchange', sendRouteChange);
})();