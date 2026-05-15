describe('slug creation rule', () => {
  it('converts company names into URL-safe slugs', () => {
    const slug = 'Website Innovator Agency!'
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    expect(slug).toBe('website-innovator-agency');
  });
});
