import type { SettingsSchema } from '../common/settings';

const TARGET_BUTTON_SELECTOR =
  ':where(#database-password, #restart-project) button';
const BRANCH_NAME_SELECTORS = [
  '#__next main > div:first-child > div:first-child > div:last-child > button p',
  '#__next main > div:first-child > div:first-child > button:last-child span',
];
const settings = await new Promise<SettingsSchema>((resolve) => {
  chrome.storage.local.get(['mySetting'], (result) => {
    if (result.mySetting) {
      resolve(result.mySetting);
    } else {
      resolve({
        branches: [
          {
            name: 'main',
            enable: true,
          },
        ],
      });
    }
  });
});

const disableButton = () => {
  const button = document.querySelector<HTMLButtonElement>(
    TARGET_BUTTON_SELECTOR,
  );
  const branchName = document
    .querySelector(BRANCH_NAME_SELECTORS.join(', '))
    ?.textContent?.trim();

  if (!branchName || !button || button.disabled) {
    return;
  }

  if (
    settings.branches.some(
      ({ enable, name }) =>
        enable &&
        (name === branchName ||
          (name === 'main' && branchName === 'Enable branching')),
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
