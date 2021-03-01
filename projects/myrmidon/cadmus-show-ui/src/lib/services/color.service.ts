import { Injectable } from '@angular/core';

/**
 * Colors helper service.
 */
@Injectable({
  providedIn: 'root',
})
export class ColorService {
  /**
   * Get the R,G,B components of the color expressed by the specified
   * RGB string (3 or 6 digits format).
   *
   * @param rgb The RGB color string (3 or 6 digits).
   * @returns An object, or null if invalid input string.
   */
  public parseRgb(rgb?: string): { r: number; g: number; b: number } | null {
    if (!rgb) {
      return null;
    }

    // RGB
    let m = rgb.match(/^#?([0-9a-f]{3})$/i);
    if (m && m[1]) {
      // in 3-characters format, each value is multiplied by 0x11 to give an
      // even scale from 0x00 to 0xff
      return {
        r: parseInt(m[1].charAt(0), 16) * 0x11,
        g: parseInt(m[1].charAt(1), 16) * 0x11,
        b: parseInt(m[1].charAt(2), 16) * 0x11,
      };
    }
    // RRGGBB
    m = rgb.match(/^#?([0-9a-f]{6})$/i);
    if (m && m[1]) {
      return {
        r: parseInt(m[1].substr(0, 2), 16),
        g: parseInt(m[1].substr(2, 2), 16),
        b: parseInt(m[1].substr(4, 2), 16),
      };
    }
    return null;
  }

  /**
   * Get black or white according to which of them has the maximum contrast
   * against the specified color.
   *
   * @param rgb The RGB color string.
   * @returns Black or white. If rgb is invalid, always black.
   */
  public getContrastColor(rgb: string): string {
    // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
    const color = this.parseRgb(rgb);
    if (!color) {
      return 'black';
    }
    return color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 186
      ? 'black'
      : 'white';
  }

  /**
   * Convert HSL to RGB.
   *
   * @param h Hue
   * @param s Saturation
   * @param l Lightness
   * @returns Object with r, g, b values.
   */
  public hslToRgb(
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } {
    // https://css-tricks.com/converting-color-spaces-in-javascript/
    // must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r: r, g: g, b: b };
  }

  public rgbToString(r: number, g: number, b: number): string {
    let rd = r.toString(16);
    if (rd.length === 1) {
      rd = '0' + rd;
    }
    let gd = g.toString(16);
    if (gd.length === 1) {
      gd = '0' + gd;
    }
    let bd = b.toString(16);
    if (bd.length === 1) {
      bd = '0' + bd;
    }
    return rd + gd + bd;
  }

  /**
   * Get the next color from a palette generated to include
   * the specified count of colors.
   *
   * @param index The index of the next color in the palette.
   * @param count The total count of colors in the palette.
   * @returns The RRGGBB values string.
   */
  public nextPaletteColor(
    index: number,
    count: number,
    blueBoost = true
  ): string {
    // https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript
    const h = Math.floor((index / count) * 341); // between 0 and 340
    let s = 100;
    let l = 50;

    if (blueBoost && h > 215 && h < 265) {
      const gain = 20;
      let blueness = 1 - Math.abs(h - 240) / 25;
      let change = Math.floor(gain * blueness);
      l += change;
      s -= change;
    }
    const rgb = this.hslToRgb(h, s, l);
    return this.rgbToString(rgb.r, rgb.g, rgb.b);
  }
}
