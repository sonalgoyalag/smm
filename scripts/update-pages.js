#!/usr/bin/env node

/**
 * Script to help convert existing HTML pages to use the component system
 * This is a helper script - you should still review each page manually
 */

const fs = require('fs');
const path = require('path');

const pagesToUpdate = [
    'about.html',
    'contact.html',
    'donate.html',
    'gallery.html',
    'what-we-do.html'
];

const templatePath = path.join(__dirname, '..', 'components', 'page-template.html');

function updatePage(pagePath) {
    console.log(`\n📄 Processing ${pagePath}...`);
    
    if (!fs.existsSync(pagePath)) {
        console.log(`❌ File ${pagePath} not found`);
        return;
    }
    
    const originalContent = fs.readFileSync(pagePath, 'utf8');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Extract main content (everything between header and footer)
    const headerEnd = originalContent.indexOf('</header>');
    const footerStart = originalContent.indexOf('<footer');
    
    if (headerEnd === -1 || footerStart === -1) {
        console.log(`❌ Could not find header/footer boundaries in ${pagePath}`);
        return;
    }
    
    // Extract the main content
    let mainContent = originalContent.substring(headerEnd + 9, footerStart).trim();
    
    // Remove any leftover header/footer components or mobile nav
    mainContent = mainContent.replace(/<div class="mobile-nav__wrapper">[\s\S]*?<\/div>\s*<!-- \/.mobile-nav__wrapper -->/g, '');
    mainContent = mainContent.replace(/<div class="search-popup[\s\S]*?<\/div>\s*<!-- \/.search-popup -->/g, '');
    mainContent = mainContent.replace(/<a href="#"[\s\S]*?scroll-to-top[\s\S]*?<\/a>/g, '');
    mainContent = mainContent.replace(/<aside class="sidebar-one">[\s\S]*?<\/aside>/g, '');
    
    // Create updated page content
    const updatedContent = template.replace(
        '<!-- PAGE CONTENT GOES HERE -->\n        <main>\n            <!-- Add your page-specific content here -->\n        </main>',
        mainContent
    );
    
    // Create backup
    const backupPath = `${pagePath}.backup`;
    fs.writeFileSync(backupPath, originalContent);
    
    // Write updated content
    fs.writeFileSync(pagePath, updatedContent);
    
    console.log(`✅ Updated ${pagePath} (backup saved as ${backupPath})`);
}

function main() {
    console.log('🚀 Starting page update process...');
    console.log('This will update all pages to use the component system.');
    
    const projectRoot = path.join(__dirname, '..');
    
    pagesToUpdate.forEach(page => {
        const pagePath = path.join(projectRoot, page);
        updatePage(pagePath);
    });
    
    console.log('\n✅ Page update process completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Review each updated page');
    console.log('2. Test the website functionality');
    console.log('3. Remove .backup files when satisfied');
    console.log('4. Update page titles if needed');
}

if (require.main === module) {
    main();
}

module.exports = { updatePage };
