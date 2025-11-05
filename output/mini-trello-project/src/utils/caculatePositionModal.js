
// tính vị trí để hiển thị modal
export function caculatePositionModal(clickPosition, modalSize, options = {}) {
  const {
    padding = 20, // Padding quanh modal - tùy chọn
  } = options;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Vị trí ban đầu - chính là vị trí được click.
  let left = clickPosition.x;
  let top = clickPosition.y;

  // Kiểm tra nếu modal bị tràn sang phải ==> đẩy modal sang trái - căn sát phải
  if (left + modalSize.width > viewportWidth) {
    left = viewportWidth - modalSize.width - padding;
  }

  // Kiểm tra nếu modal bị tràn xuống dưới - đẩy modal lên trên - căn sát dưới
  if (top + modalSize.height + padding > viewportHeight) {
    top = viewportHeight - modalSize.height - padding;
  }

  left = Math.max(padding, left);
  top = Math.max(padding, top);

  return { top, left };
}
