"""
ZENORA DESIGNS - Video to Walkthrough Frame Sequence Converter
Usage:
    python process_video.py --video "path/to/walkthrough.mp4"
    python process_video.py --video "path/to/walkthrough.mp4" --fps 15 --max_frames 300
"""

import os
import sys
import argparse
import cv2
import json

def process_video(video_path, output_dir="assets/frames", target_frames=300, quality=85):
    if not os.path.exists(video_path):
        print(f"Error: Video file not found: {video_path}")
        return False

    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Unable to open video {video_path}")
        return False

    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    duration = total_video_frames / video_fps
    
    print(f"Video Info:")
    print(f"  - Source: {video_path}")
    print(f"  - Total Video Frames: {total_video_frames}")
    print(f"  - FPS: {video_fps:.2f}")
    print(f"  - Duration: {duration:.2f}s")
    print(f"  - Target Frame Count for Scroll: {target_frames}")

    # Determine frame step to get evenly spaced target_frames
    step = max(1.0, total_video_frames / float(target_frames))
    extracted_count = 0

    current_idx = 0.0
    while current_idx < total_video_frames and extracted_count < target_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(current_idx))
        ret, frame = cap.read()
        if not ret:
            break

        # Resize to standard full HD if larger
        h, w = frame.shape[:2]
        if w > 1920:
            scale = 1920.0 / w
            frame = cv2.resize(frame, (1920, int(h * scale)), interpolation=cv2.INTER_AREA)

        extracted_count += 1
        out_filename = f"frame_{extracted_count:04d}.webp"
        out_path = os.path.join(output_dir, out_filename)
        cv2.imwrite(out_path, frame, [cv2.IMWRITE_WEBP_QUALITY, quality])

        if extracted_count % 30 == 0 or extracted_count == target_frames:
            print(f"  Extracted {extracted_count}/{target_frames} frames...")

        current_idx += step

    cap.release()

    # Write manifest JSON for the web engine
    manifest = {
        "frameCount": extracted_count,
        "format": "webp",
        "prefix": "frame_",
        "digits": 4,
        "originalVideo": os.path.basename(video_path),
        "extractedDate": cv2.__version__
    }
    with open(os.path.join(output_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nSuccess! Successfully extracted {extracted_count} frames into '{output_dir}'.")
    print("Zenora Interactive Walkthrough will automatically load these frames on refresh!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert walkthrough video into Zenora scroll frames")
    parser.add_argument("--video", required=True, help="Path to input MP4 or MOV video file")
    parser.add_argument("--frames", type=int, default=300, help="Target number of frames for scroll sequence (default: 300)")
    parser.add_argument("--quality", type=int, default=85, help="WebP compression quality (1-100, default: 85)")
    args = parser.parse_args()

    process_video(args.video, target_frames=args.frames, quality=args.quality)
