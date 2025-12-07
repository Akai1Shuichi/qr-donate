(function () {
  try {
    require("./style.css");
  } catch (e) {}
  const BANK_ID = "970436";
  const ACCOUNT_NO = "1032111989";
  const ACCOUNT_NAME = "NGUYEN TRONG TOAN";
  const TEMPLATE = "compact2";

  const form = document.getElementById("donate-form");
  const amountInput = document.getElementById("amount");
  const messageInput = document.getElementById("message");
  const remainEl = document.getElementById("remain");
  const qrSection = document.getElementById("qr-section");
  const qrImg = document.getElementById("qr-image");
  const qrDesc = document.getElementById("qr-desc");
  const qrLink = document.getElementById("qr-link");
  const downloadBtn = document.getElementById("downloadBtn");

  // Quick amount buttons
  document.querySelectorAll(".quick > button").forEach((btn) => {
    btn.addEventListener("click", () => {
      amountInput.value = Number(btn.dataset.amt).toLocaleString("vi-VN");
      amountInput.focus();
    });
  });

  // Format amount input as Vietnamese number while storing digits
  amountInput.addEventListener("input", () => {
    const digits = amountInput.value.replace(/\D/g, "");
    amountInput.value = digits ? Number(digits).toLocaleString("vi-VN") : "";
  });

  // Character counter
  messageInput.addEventListener("input", () => {
    remainEl.textContent = String(255 - messageInput.value.length);
  });

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const amountDigits = amountInput.value.replace(/\D/g, "");
    const amountNum = Number(amountDigits || "0");
    if (amountNum < 2000) {
      alert("Vui lòng nhập số tiền tối thiểu 2.000đ");
      return;
    }

    const description = messageInput.value.trim() || "Ung ho";
    const url = buildVietQrUrl({
      bankId: BANK_ID,
      accountNo: ACCOUNT_NO,
      template: TEMPLATE,
      amount: amountNum,
      addInfo: description,
      accountName: ACCOUNT_NAME,
    });

    qrImg.src = url;
    qrImg.alt = "VietQR - " + ACCOUNT_NAME;
    qrDesc.textContent = `Số tiền: ${amountNum.toLocaleString(
      "vi-VN"
    )}đ • Nội dung: ${description}`;
    qrLink.href = url;
    qrSection.classList.remove("hidden");
    qrImg.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  downloadBtn.addEventListener("click", async () => {
    if (!qrImg.src) return;
    const res = await fetch(qrImg.src, { mode: "cors" });
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vietqr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  });

  function buildVietQrUrl({
    bankId,
    accountNo,
    template,
    amount,
    addInfo,
    accountName,
  }) {
    const base = `https://img.vietqr.io/image/${encodeURIComponent(
      bankId
    )}-${encodeURIComponent(accountNo)}-${encodeURIComponent(template)}.png`;
    const params = new URLSearchParams();
    params.set("amount", String(amount));
    if (addInfo) params.set("addInfo", addInfo);
    if (accountName) params.set("accountName", accountName);
    return `${base}?${params.toString()}`;
  }
})();
