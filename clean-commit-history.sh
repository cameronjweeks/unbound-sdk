#!/bin/bash

# Clean Git History - Remove Development Iterations
# Creates a clean, professional commit history

set -e

echo "🧹 Creating clean git history..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

cd /docker/app1-api/sdk

echo -e "${BLUE}📝 Creating clean commit history...${NC}"

# Create a temporary backup branch
git branch -D backup-original-history 2>/dev/null || true
git branch backup-original-history

# Create a new orphan branch (no history)
git checkout --orphan clean-main

# Add all current files
git add .

# Create a single, clean initial commit
git commit -m "Initial Release: Unbound SDK v1.0.0

Complete JavaScript SDK for Unbound's communication and AI platform.

Features:
• 21 comprehensive services with full API coverage
• Universal transport system (NATS/Socket/HTTP)
• Object-based constructor with backwards compatibility
• Cross-platform Node.js and browser support
• Messaging: SMS/MMS, Email campaigns and templates
• Communication: Voice calling, video conferencing
• AI Services: Generative AI and text-to-speech
• Data Management: Object CRUD with advanced querying
• Workflow Automation: Programmable workflow execution
• Comprehensive API documentation and examples

Technical Implementation:
• Modular architecture with individual service files
• Transport plugin system for optimal performance
• Parameter validation and comprehensive error handling
• ESM modules with universal compatibility
• TypeScript definitions ready
• 100% backwards compatible with legacy implementations

Package Information:
• NPM: @unboundcx/sdk
• GitHub: github.com/cameronjweeks/unbound-sdk
• License: MIT
• Node.js 16+ required

Ready for production use and public distribution."

# Delete the old main branch and rename clean-main to main
git branch -D main 2>/dev/null || true
git branch -m clean-main main

echo -e "${GREEN}✅ Clean history created!${NC}"
echo ""
echo -e "${YELLOW}📤 Ready to force push clean history:${NC}"
echo -e "${BLUE}git push --force-with-lease origin main${NC}"
echo ""
echo -e "${RED}⚠️  This will completely overwrite GitHub repository history!${NC}"
echo ""
echo "Backup of original history saved as branch: backup-original-history"
echo ""

read -p "Push clean history to GitHub now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Pushing clean history to GitHub...${NC}"
    git push --force-with-lease origin main
    echo -e "${GREEN}✅ Clean history pushed to GitHub!${NC}"
    
    echo ""
    echo -e "${GREEN}🎉 Repository now has clean, professional history!${NC}"
    echo ""
    echo "Summary:"
    echo "✅ Single professional initial commit"
    echo "✅ No development iterations visible" 
    echo "✅ No debugging or mistake commits"
    echo "✅ Clean commit message with full feature list"
    echo "✅ Ready for public consumption"
    echo ""
    echo "GitHub: https://github.com/cameronjweeks/unbound-sdk"
    echo "Original history backup: backup-original-history branch"
    
else
    echo "Clean history created locally. Push when ready with:"
    echo -e "${BLUE}git push --force-with-lease origin main${NC}"
fi

echo ""
echo -e "${YELLOW}🔍 New commit history:${NC}"
git log --oneline
EOF