#!/usr/bin/env python3

import os
import re

def add_mobile_css_to_pages():
    """Add mobile navigation CSS fix to all HTML pages"""
    
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and not f.startswith('create-')]
    
    print("📱 Adding mobile navigation CSS fixes to all pages...")
    
    for html_file in html_files:
        print(f"  📄 Processing {html_file}...")
        
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if mobile CSS is already added
        if 'mobile-nav-fix.css' in content:
            print(f"  ✅ {html_file} already has mobile CSS")
            continue
        
        # Add mobile CSS after cleenhearts.css
        pattern = r'(<link rel="stylesheet" href="assets/css/cleenhearts\.css" />)'
        replacement = r'\1\n    <!-- mobile navigation fixes -->\n    <link rel="stylesheet" href="assets/css/mobile-nav-fix.css" />'
        
        new_content = re.sub(pattern, replacement, content)
        
        if new_content != content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  ✅ Added mobile CSS to {html_file}")
        else:
            print(f"  ⚠️  Could not find CSS insertion point in {html_file}")

if __name__ == "__main__":
    add_mobile_css_to_pages()
    print("\n✅ Mobile navigation CSS fixes applied to all pages!")
    print("\n📱 Mobile navigation should now work properly on responsive devices.")
