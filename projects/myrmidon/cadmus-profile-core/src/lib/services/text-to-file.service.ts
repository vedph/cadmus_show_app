import { Injectable } from '@angular/core';

/**
 * Service to let user download a text file generated into a string.
 */
@Injectable({
  providedIn: 'root',
})
export class TextToFileService {
  constructor() {}

  /**
   * Save the specified text into a file.
   *
   * @param text The text content to be saved.
   * @param name The file name.
   * @param contentType The content type.
   */
  public saveToFile(
    text: string,
    name: string,
    contentType = 'text/plain'
  ): void {
    // https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js
    const a = document.createElement('a');
    const file = new Blob([text], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();

    URL.revokeObjectURL(a.href);
  }
}
