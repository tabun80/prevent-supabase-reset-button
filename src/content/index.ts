import type { SettingsSchema } from '../common/settings';

const TARGET_BUTTON_SELECTOR = '#database-password button';
const BRANCH_NAME_SELECTOR =
  '#__next > div.min-h-full.flex.flex-col > div.h-screen.min-h-\\[0px\\].basis-0.flex-1 > div > div.w-full.data-\\[panel-group-direction\\=vertical\\]\\:flex-col.flex.h-full > div.h-full > main > div > div.-ml-2.flex.items-center.text-sm > div:nth-child(5) > button > span > div > p';

const settings = await new Promise<SettingsSchema>((resolve) => {
  chrome.storage.local.get(['mySetting'], (result) => {
    if (result.mySetting) {
      resolve(result.mySetting);
    }
  });
});

const disableButton = () => {
  const button = document.querySelector<HTMLButtonElement>(
    TARGET_BUTTON_SELECTOR,
  );
  const branchName = document.querySelector(BRANCH_NAME_SELECTOR)?.textContent;

  if (!branchName || !button || button.disabled) {
    return;
  }

  if (
    settings.branches.some(
      (branch) => branch.enable && branch.name === branchName,
    )
  ) {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';

    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const overlay = document.createElement('span');
    overlay.textContent = '✖';
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.color = 'red';
    overlay.style.fontSize = '20px';
    overlay.style.pointerEvents = 'none';
    button.style.position = 'relative';
    button.appendChild(overlay);
  }
};

disableButton();

const observer = new MutationObserver(disableButton);
observer.observe(document.body, { childList: true, subtree: true });
