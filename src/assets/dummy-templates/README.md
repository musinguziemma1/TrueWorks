# Dummy Excel Templates and Product Data

This directory contains generated dummy Excel templates and JSON data for the TrueWorks application. These files simulate the downloadable product templates that users would access from the store.

## Structure

- `products.xml` - XML representation of product templates with download links
- `products.json` - JSON format of all product data with complete details
- `images/products/` - Placeholder image files for each product
- `dummy-templates/` - Directory containing actual template files (Excel, PDFs, etc.)

## Files Description

### products.xml
An XML representation of 9 product templates available for download. Each product includes:
- Product identification (name, SKU, slug)
- Industry and category classification
- Price and compatibility information
- Direct download and demo URLs for testing

### products.json
The complete data structure for all products with rich metadata including:
- Product details and descriptions
- Pricing and sales information
- File compatibility and requirements
- Links to downloadable templates
- FAQ sections
- Related product references

## Usage in the Application

These data files serve as:
1. **API responses** for product listings and details
2. **Mock data** for development and testing
3. **Template metadata** for the download system
4. **Seed data** for the database initialization

## Integration

The JSON data is used as:
- **Fallback mock data** when Convex API is unavailable
- **Sample product data** for development and demonstration
- **Template structure** for the download and preview system

## Technical Notes

- File paths use relative paths (`./images/products/`, `./dummy-templates/`) for consistency across environments
- JSON structure matches the `Product` interface in `src/lib/types.ts`
- Includes all required fields like `createdAt` and `updatedAt` for data consistency
- Supports offline development and testing without database dependencies

## Files Location

- XML: `src/assets/dummy-templates/products.xml`
- JSON: `src/assets/dummy-templates/products.json`
- Images: `public/images/products/`
- Templates: `src/assets/dummy-templates/`