/* eslint-disable no-unused-vars */
// Format first name
export const formatFirstName = (name) => {
  return name.split('')[0].toUpperCase() + name.slice(1);
};

// Format last name
export const formatLastName = (name) => {
  return name
    .toLowerCase()
    .split(/[-\s]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
};

// Format image
export const formatImage = (file, setAvatarImg) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxSize = Math.max(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = maxSize;
      canvas.height = maxSize;
      const ctx = canvas.getContext('2d');

      // Draw a circular clip mask
      ctx.beginPath();
      ctx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Calculate the scaled dimensions to cover the circle
      const aspectRatio = img.width / img.height;
      let newWidth, newHeight;

      if (aspectRatio >= 1) {
        newWidth = maxSize;
        newHeight = maxSize / aspectRatio;
      } else {
        newWidth = maxSize * aspectRatio;
        newHeight = maxSize;
      }

      // Calculate scale to cover the circle while maintaining aspect ratio
      const scale = Math.max(maxSize / newWidth, maxSize / newHeight);

      // Calculate dimensions after scaling
      const scaledWidth = newWidth * scale;
      const scaledHeight = newHeight * scale;

      // Calculate offsets to center the image
      const offsetX = (maxSize - scaledWidth) / 2;
      const offsetY = (maxSize - scaledHeight) / 2;

      // Draw the scaled image on the canvas
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      // Convert the canvas content to base64 and set as avatarImg
      const circularImageBase64 = canvas.toDataURL('image/jpeg');
      setAvatarImg(circularImageBase64);
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ')-' + match[2] + '-' + match[3];
  }

  return phoneNumber;
};

// Prevent letters being typed into the sessions input
export const handleKeyPress = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  if (keyCode !== 8 && !/^\d$/.test(keyValue)) {
    event.preventDefault();
  }
};

// Process avatar image
export const processAvatarImage = async (imgFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = Math.max(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');

        // Draw a circular clip mask
        ctx.beginPath();
        ctx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Calculate the scaled dimensions to cover the circle
        const aspectRatio = img.width / img.height;
        let newWidth, newHeight;

        if (aspectRatio >= 1) {
          newWidth = maxSize;
          newHeight = maxSize / aspectRatio;
        } else {
          newWidth = maxSize * aspectRatio;
          newHeight = maxSize;
        }

        // Calculate scale to cover the circle while maintaining aspect ratio
        const scale = Math.max(maxSize / newWidth, maxSize / newHeight);

        // Calculate dimensions after scaling
        const scaledWidth = newWidth * scale;
        const scaledHeight = newHeight * scale;

        // Calculate offsets to center the image
        const offsetX = (maxSize - scaledWidth) / 2;
        const offsetY = (maxSize - scaledHeight) / 2;

        // Draw the scaled image on the canvas
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // Create a new canvas for the final circular image
        const circularCanvas = document.createElement('canvas');
        circularCanvas.width = maxSize;
        circularCanvas.height = maxSize;
        const circularCtx = circularCanvas.getContext('2d');

        // Draw a circular mask on the new canvas
        circularCtx.beginPath();
        circularCtx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2);
        circularCtx.closePath();
        circularCtx.clip();

        // Draw the circular image onto the new canvas
        circularCtx.drawImage(canvas, 0, 0);

        // Convert the circular canvas content back to a file
        circularCanvas.toBlob(
          async (blob) => {
            const circularImageFile = new File([blob], imgFile.name, {
              type: 'image/jpeg',
            });
            resolve(circularImageFile);
          },
          'image/jpeg',
          1
        );
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(imgFile);
  });
};
