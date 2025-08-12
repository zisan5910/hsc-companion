import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Chrome, ExternalLink } from "lucide-react";

export const SmartRedirect = () => {
  const [showRedirect, setShowRedirect] = useState(false);
  const [userAgent, setUserAgent] = useState("");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const referrer = document.referrer.toLowerCase();
    
    // Detect if opened from social media apps
    const isFromSocialApp = 
      ua.includes('fban') || // Facebook App
      ua.includes('fbav') || // Facebook App
      ua.includes('instagram') ||
      ua.includes('whatsapp') ||
      ua.includes('messenger') ||
      referrer.includes('facebook') ||
      referrer.includes('instagram') ||
      referrer.includes('whatsapp') ||
      referrer.includes('messenger');

    const isInWebView = 
      ua.includes('wv') || // Android WebView
      ua.includes('version') && ua.includes('mobile safari') && !ua.includes('chrome'); // iOS WebView

    if (isFromSocialApp || isInWebView) {
      setShowRedirect(true);
      setUserAgent(ua);
    }

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setShowRedirect(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenInChrome = () => {
    const currentUrl = window.location.href;
    
    // Try to detect if the app is already installed
    if ('serviceWorker' in navigator) {
      // Check if running as PWA
      if (window.matchMedia('(display-mode: standalone)').matches) {
        // Already in PWA mode
        setShowRedirect(false);
        return;
      }
    }

    // Create intent URLs for different browsers
    const chromeIntent = `googlechrome://navigate?url=${encodeURIComponent(currentUrl)}`;
    const universalIntent = `intent://navigate?url=${encodeURIComponent(currentUrl)}#Intent;scheme=https;package=com.android.chrome;end`;
    
    try {
      // Try Chrome intent first
      window.location.href = chromeIntent;
      
      // Fallback to opening in same window after a short delay
      setTimeout(() => {
        window.open(currentUrl, '_blank');
      }, 1000);
    } catch (error) {
      // Fallback to direct navigation
      window.open(currentUrl, '_blank');
    }
    
    setShowRedirect(false);
  };

  const handleDismiss = () => {
    setShowRedirect(false);
  };

  if (!showRedirect) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-sm glass-card border-glass-border">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Chrome className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              সেরা অভিজ্ঞতার জন্য Chrome-এ খুলুন
            </h3>
            <p className="text-sm text-muted-foreground">
              আরও ভালো পারফরমেন্স এবং ফিচারের জন্য Chrome ব্রাউজারে খুলুন
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleOpenInChrome}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              <Chrome className="h-4 w-4" />
              ক্রোমে খুলুন
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              এখানেই চালিয়ে যান
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            অ্যাপটি ইনস্টল করা থাকলে স্বয়ংক্রিয়ভাবে খুলে যাবে
          </p>
        </CardContent>
      </Card>
    </div>
  );
};