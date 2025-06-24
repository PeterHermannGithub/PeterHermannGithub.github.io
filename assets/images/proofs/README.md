# Achievement Proof Images

This directory contains proof images for achievements displayed on the achievements page.

## Required Proof Images

### Academic Achievements
- `degree-certificate.jpg` (400x600px) - University diploma/certificate
- `msc-progress.jpg` (400x600px) - Current MSc studies verification

### Professional Achievements  
- `employee-award.jpg` (400x600px) - Best Employee award certificate
- `rust-performance.png` (800x600px) - Pure Rust engine performance benchmarks
- `performance-benchmark.png` (800x600px) - Performance optimization results

### Athletic Achievements
- `running-certificate.jpg` (400x600px) - Race completion certificate or medal photo

## Image Guidelines

### Format Requirements
- **Academic/Professional Certificates**: JPG format, 400x600px (portrait)
- **Technical Screenshots**: PNG format, 800x600px (landscape) 
- **Athletic Proof**: JPG format, 400x600px (portrait)

### Optimization
- Compress images for web delivery (target < 500KB per image)
- Use WebP format where possible with JPG/PNG fallbacks
- Include descriptive alt text for accessibility

### Privacy Considerations
- Blur or redact sensitive personal information (ID numbers, addresses)
- Ensure all images have appropriate permissions for public display
- Consider watermarking valuable certificates

## Integration

Proof images are automatically loaded by the achievement modal system:
- Images are referenced via `data-proof-image` attribute on achievement cards
- Fallback system displays placeholder if image is missing
- Modal system supports zoom and keyboard navigation

## Fallback System

If proof images are not available:
- Graceful fallback displays "Proof Coming Soon" message
- Professional placeholder maintains visual consistency
- System continues to function without breaking user experience