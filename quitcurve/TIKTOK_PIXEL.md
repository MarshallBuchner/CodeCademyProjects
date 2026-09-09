# TikTok Pixel (QuitCurve)

Wire-up is in the app. You still need to **create the pixel** and **set the env var**.

## 1. Create the pixel (TikTok Ads Manager)

1. Open [ads.tiktok.com](https://ads.tiktok.com) → **QuitCurve_adv**
2. **Assets** → **Events** (Web Events)
3. **Set up web events** → **TikTok Pixel** → **Manually install pixel code**
4. Name it `QuitCurve` → copy the **Pixel ID**

## 2. Add env on Vercel (production)

In the **quitcurve** Vercel project → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | your Pixel ID |

Redeploy after saving (or push the publish commit below).

## 3. What we fire

| User action | TikTok event | Why |
|-------------|--------------|-----|
| Any page | `PageView` (auto) | Audience / reach |
| Build my quit plan | `ClickButton` | Mid-funnel |
| Onboarding opens | `ViewContent` | Mid-funnel |
| Plan created (guest or account) | **`CompleteRegistration`** | **Primary conversion** |
| Account signup | `Subscribe` | Secondary |

Keep the current **Traffic** campaign until Events Manager shows these events. Then test a small **Conversions** campaign optimized to `CompleteRegistration`.

## 4. Verify

1. Open quitcurve.app with the TikTok Pixel Helper browser extension (or Events Manager → Test Events)
2. Click **Build my quit plan** → expect `ClickButton`
3. Finish a guest plan → expect `CompleteRegistration`

## 5. Privacy

Privacy policy mentions TikTok ads measurement. No extra SQL needed.
