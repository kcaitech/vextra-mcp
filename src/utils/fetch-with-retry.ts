import fs from "fs";
import path from "path";

import { exec } from "child_process";
import { promisify } from "util";
import { Logger } from "./logger.js";

const execAsync = promisify(exec);

export async function fetchWithRetry<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}: ${response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (fetchError: any) {
    Logger.log(
      `[fetchWithRetry] Initial fetch failed for ${url}: ${fetchError.message}. Likely a corporate proxy or SSL issue. Attempting curl fallback.`,
    );

    const curlHeaders = formatHeadersForCurl(options.headers);
    const curlCommand = `curl -s -L ${curlHeaders.join(" ")} "${url}"`;

    try {
      // Fallback to curl for  corporate networks that have proxies that sometimes block fetch
      Logger.log(`[fetchWithRetry] Executing curl command: ${curlCommand}`);
      const { stdout, stderr } = await execAsync(curlCommand);

      if (stderr) {
        // curl often outputs progress to stderr, so only treat as error if stdout is empty
        // or if stderr contains typical error keywords.
        if (
          !stdout ||
          stderr.toLowerCase().includes("error") ||
          stderr.toLowerCase().includes("fail")
        ) {
          throw new Error(`Curl command failed with stderr: ${stderr}`);
        }
        Logger.log(
          `[fetchWithRetry] Curl command for ${url} produced stderr (but might be informational): ${stderr}`,
        );
      }

      if (!stdout) {
        throw new Error("Curl command returned empty stdout.");
      }

      return JSON.parse(stdout) as T;
    } catch (curlError: any) {
      Logger.error(`[fetchWithRetry] Curl fallback also failed for ${url}: ${curlError.message}`);
      // Re-throw the original fetch error to give context about the initial failure
      // or throw a new error that wraps both, depending on desired error reporting.
      // For now, re-throwing the original as per the user example's spirit.
      throw fetchError;
    }
  }
}

/**
 * Converts HeadersInit to an array of curl header arguments.
 * @param headers Headers to convert.
 * @returns Array of strings, each a curl -H argument.
 */
function formatHeadersForCurl(headers: HeadersInit | undefined): string[] {
  if (!headers) {
    return [];
  }

  const curlHeaders: string[] = [];

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      curlHeaders.push(`-H "${key}: ${value}"`);
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      curlHeaders.push(`-H "${key}: ${value}"`);
    });
  } else {
    Object.entries(headers).forEach(([key, value]) => {
      curlHeaders.push(`-H "${key}: ${value}"`);
    });
  }
  return curlHeaders;
}


/**
 * Download a file and save it locally
 * @param fileName - The filename to save as
 * @param localPath - The local path to save to
 * @param imageUrl - Image URL (images[nodeId])
 * @returns A Promise that resolves to the full file path where the image was saved
 * @throws Error if download fails
 */
export async function downloadFile(
  fileName: string,
  localPath: string,
  imageUrl: string,
): Promise<string> {
  try {
    // Ensure local path exists
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }

    // Build the complete file path
    const fullPath = path.join(localPath, fileName);

    // Use fetch to download the image
    const response = await fetch(imageUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    // Create write stream
    const writer = fs.createWriteStream(fullPath);

    // Get the response as a readable stream and pipe it to the file
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response body");
    }

    return new Promise((resolve, reject) => {
      // Process stream
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              writer.end();
              break;
            }
            writer.write(value);
          }
        } catch (err) {
          writer.end();
          fs.unlink(fullPath, () => { });
          reject(err);
        }
      };

      // Resolve only when the stream is fully written
      writer.on('finish', () => {
        resolve(fullPath);
      });

      writer.on("error", (err) => {
        reader.cancel();
        fs.unlink(fullPath, () => { });
        reject(new Error(`Failed to write image: ${err.message}`));
      });

      processStream();
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error downloading image: ${errorMessage}`);
  }
}


export function saveFile(
  fileName: string,
  localPath: string,
  data: Uint8Array,
): string {
  const fullPath = path.join(localPath, fileName);
  // Ensure local path exists
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath, { recursive: true });
  }
  fs.writeFileSync(fullPath, data);
  return fullPath;
}