/**
 * VS Code Interface JavaScript
 * Handles file tree, code display, syntax highlighting, and user interactions
 */

class CodeViewer {
    constructor() {
        this.codeData = null;
        this.currentFile = null;
        this.openTabs = new Map();
        this.activeTab = null;
        this.sidebarCollapsed = false;
        
        // DOM elements
        this.elements = {
            loading: document.getElementById('vscode-loading'),
            interface: document.getElementById('vscode-interface'),
            sidebar: document.getElementById('vscode-sidebar'),
            fileTree: document.getElementById('file-tree'),
            tabBar: document.getElementById('tab-bar'),
            welcomeScreen: document.getElementById('welcome-screen'),
            codeEditor: document.getElementById('code-editor'),
            codeDisplay: document.getElementById('code-display'),
            lineNumbers: document.getElementById('line-numbers'),
            fileIcon: document.getElementById('file-icon'),
            filePath: document.getElementById('file-path'),
            statusBar: document.getElementById('status-bar'),
            fileType: document.getElementById('file-type'),
            lineCount: document.getElementById('line-count'),
            fileSize: document.getElementById('file-size'),
            sidebarToggle: document.getElementById('sidebar-toggle'),
            copyCodeBtn: document.getElementById('copy-code-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            mobileFileSelector: document.getElementById('mobile-file-selector'),
            mobileFileList: document.getElementById('mobile-file-list'),
            mobileSelectorClose: document.getElementById('mobile-selector-close')
        };

        this.initializeCodeViewer();
    }

    async initializeCodeViewer() {
        try {
            console.log('🎯 Initializing Code Viewer...');
            
            // Show loading state
            this.showLoading();
            
            // Load code data
            await this.loadCodeData();
            
            // Initialize interface
            this.setupEventListeners();
            this.renderFileTree();
            this.setupMobileInterface();
            
            // Handle URL parameters for direct file access
            this.handleURLParameters();
            
            // Hide loading and show interface
            this.hideLoading();
            
            console.log('✅ Code Viewer initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Code Viewer:', error);
            this.showError('Failed to load code viewer. Please try again.');
        }
    }

    async loadCodeData() {
        try {
            console.log('📥 Loading code snippets data...');
            const response = await fetch('assets/data/code-snippets.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.codeData = await response.json();
            console.log('✅ Code data loaded:', Object.keys(this.codeData.files).length, 'files');
            
        } catch (error) {
            console.error('❌ Error loading code data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Sidebar toggle
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Code actions
        if (this.elements.copyCodeBtn) {
            this.elements.copyCodeBtn.addEventListener('click', () => {
                this.copyCurrentCode();
            });
        }

        if (this.elements.fullscreenBtn) {
            this.elements.fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Mobile file selector
        if (this.elements.mobileSelectorClose) {
            this.elements.mobileSelectorClose.addEventListener('click', () => {
                this.closeMobileSelector();
            });
        }

        // Mobile interface toggle
        this.setupMobileToggle();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Responsive sidebar handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    renderFileTree() {
        if (!this.codeData || !this.elements.fileTree) return;

        console.log('🌳 Rendering file tree...');
        const treeHtml = this.generateTreeHTML(this.codeData.fileTree, '');
        this.elements.fileTree.innerHTML = treeHtml;

        // Add click listeners to files and folders
        this.elements.fileTree.addEventListener('click', (e) => {
            this.handleTreeClick(e);
        });

        console.log('✅ File tree rendered');
    }

    generateTreeHTML(node, path) {
        let html = '';

        for (const [name, children] of Object.entries(node)) {
            const currentPath = path ? `${path}/${name}` : name;
            const isFile = children === null;
            
            if (isFile) {
                const fileIcon = this.getFileIcon(name);
                const fileType = this.getFileType(name);
                
                html += `
                    <div class="file-tree-file" data-file="${currentPath}" data-type="${fileType}">
                        <div class="file-tree-item">
                            <span class="file-icon ${fileType}">${fileIcon}</span>
                            <span class="file-name">${name}</span>
                        </div>
                    </div>
                `;
            } else {
                const isExpanded = true; // Default to expanded for better UX
                const folderClass = isExpanded ? 'expanded' : 'collapsed';
                
                html += `
                    <div class="file-tree-folder ${folderClass}" data-folder="${currentPath}">
                        <div class="file-tree-item">
                            <span class="folder-icon"></span>
                            <span class="file-name">${name}</span>
                        </div>
                        <div class="file-tree-children" style="${isExpanded ? '' : 'display: none;'}">
                            ${this.generateTreeHTML(children, currentPath)}
                        </div>
                    </div>
                `;
            }
        }

        return html;
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'py': '🐍',
            'txt': '📄',
            'md': '📝',
            'json': '📋',
            'js': '📜',
            'html': '🌐',
            'css': '🎨',
            'yml': '⚙️',
            'yaml': '⚙️'
        };
        return iconMap[ext] || '📄';
    }

    getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'py': 'python',
            'txt': 'text',
            'md': 'markdown',
            'json': 'json',
            'js': 'javascript',
            'html': 'html',
            'css': 'css'
        };
        return typeMap[ext] || 'text';
    }

    handleTreeClick(e) {
        const fileElement = e.target.closest('.file-tree-file');
        const folderElement = e.target.closest('.file-tree-folder');

        if (fileElement) {
            const filePath = fileElement.dataset.file;
            this.openFile(filePath);
        } else if (folderElement) {
            this.toggleFolder(folderElement);
        }
    }

    toggleFolder(folderElement) {
        const children = folderElement.querySelector('.file-tree-children');
        const isExpanded = folderElement.classList.contains('expanded');

        if (isExpanded) {
            folderElement.classList.remove('expanded');
            folderElement.classList.add('collapsed');
            if (children) children.style.display = 'none';
        } else {
            folderElement.classList.remove('collapsed');
            folderElement.classList.add('expanded');
            if (children) children.style.display = 'block';
        }
    }

    async openFile(filePath) {
        try {
            console.log(`📂 Opening file: ${filePath}`);

            // Get file content
            const content = this.codeData.files[filePath];
            if (!content) {
                console.warn(`⚠️ File content not found: ${filePath}`);
                return;
            }

            // Update current file
            this.currentFile = filePath;

            // Add/switch to tab
            this.addTab(filePath);
            this.switchToTab(filePath);

            // Display code
            await this.displayCode(filePath, content);

            // Update file tree selection
            this.updateFileTreeSelection(filePath);

            // Update URL
            this.updateURL(filePath);

            console.log(`✅ File opened: ${filePath}`);

        } catch (error) {
            console.error(`❌ Error opening file ${filePath}:`, error);
            this.showError(`Failed to open file: ${filePath}`);
        }
    }

    addTab(filePath) {
        if (this.openTabs.has(filePath)) return;

        const fileName = filePath.split('/').pop();
        const fileIcon = this.getFileIcon(fileName);

        const tabElement = document.createElement('div');
        tabElement.className = 'tab';
        tabElement.dataset.file = filePath;
        tabElement.innerHTML = `
            <span class="tab-icon">${fileIcon}</span>
            <span class="tab-name">${fileName}</span>
            <button class="tab-close" aria-label="Close tab">×</button>
        `;

        // Add click listeners
        tabElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close')) {
                this.closeTab(filePath);
                e.stopPropagation();
            } else {
                this.switchToTab(filePath);
            }
        });

        this.elements.tabBar.appendChild(tabElement);
        this.openTabs.set(filePath, tabElement);
    }

    switchToTab(filePath) {
        // Remove active class from all tabs
        this.openTabs.forEach((tab) => {
            tab.classList.remove('active');
        });

        // Add active class to current tab
        const tab = this.openTabs.get(filePath);
        if (tab) {
            tab.classList.add('active');
        }

        this.activeTab = filePath;
    }

    closeTab(filePath) {
        const tab = this.openTabs.get(filePath);
        if (tab) {
            tab.remove();
            this.openTabs.delete(filePath);
        }

        // If this was the active tab, switch to another tab or show welcome
        if (this.activeTab === filePath) {
            if (this.openTabs.size > 0) {
                const nextTab = this.openTabs.keys().next().value;
                this.switchToTab(nextTab);
                this.openFile(nextTab);
            } else {
                this.showWelcomeScreen();
            }
        }
    }

    async displayCode(filePath, content) {
        try {
            // Hide welcome screen and show editor
            this.elements.welcomeScreen.style.display = 'none';
            this.elements.codeEditor.style.display = 'flex';

            // Update file info
            const fileName = filePath.split('/').pop();
            const fileIcon = this.getFileIcon(fileName);
            
            this.elements.fileIcon.textContent = fileIcon;
            this.elements.filePath.textContent = filePath;

            // Apply syntax highlighting
            const highlightedCode = await this.applySyntaxHighlighting(content, filePath);
            this.elements.codeDisplay.innerHTML = highlightedCode;

            // Generate line numbers
            this.generateLineNumbers(content);

            // Update status bar
            this.updateStatusBar(filePath, content);

            console.log(`✅ Code displayed for: ${filePath}`);

        } catch (error) {
            console.error(`❌ Error displaying code for ${filePath}:`, error);
            this.showError('Failed to display code');
        }
    }

    async applySyntaxHighlighting(content, filePath) {
        // Simple syntax highlighting for Python
        if (filePath.endsWith('.py')) {
            return this.highlightPython(content);
        }
        
        // For other files, just escape HTML
        return this.escapeHtml(content);
    }

    highlightPython(code) {
        let highlighted = this.escapeHtml(code);

        // Python keywords
        const keywords = [
            'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally',
            'with', 'as', 'import', 'from', 'return', 'yield', 'break', 'continue', 'pass',
            'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False', 'async', 'await',
            'lambda', 'global', 'nonlocal', 'assert', 'del', 'raise'
        ];

        // Highlight keywords
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
        });

        // Highlight strings
        highlighted = highlighted.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>');
        highlighted = highlighted.replace(/("""[^]*?"""|'''[^]*?''')/g, '<span class="string">$1</span>');

        // Highlight comments
        highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');

        // Highlight function definitions
        highlighted = highlighted.replace(/\bdef\s+(\w+)/g, 'def <span class="function">$1</span>');

        // Highlight class definitions
        highlighted = highlighted.replace(/\bclass\s+(\w+)/g, 'class <span class="class-name">$1</span>');

        // Highlight decorators
        highlighted = highlighted.replace(/(@\w+)/g, '<span class="decorator">$1</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');

        return highlighted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateLineNumbers(content) {
        const lines = content.split('\n');
        const lineNumbersHtml = lines.map((_, index) => `<div>${index + 1}</div>`).join('');
        this.elements.lineNumbers.innerHTML = lineNumbersHtml;
    }

    updateStatusBar(filePath, content) {
        const lines = content.split('\n').length;
        const bytes = new Blob([content]).size;
        const fileName = filePath.split('/').pop();
        const extension = fileName.split('.').pop().toUpperCase();

        this.elements.fileType.textContent = extension;
        this.elements.lineCount.textContent = `${lines} lines`;
        this.elements.fileSize.textContent = `${(bytes / 1024).toFixed(1)} KB`;
    }

    updateFileTreeSelection(filePath) {
        // Remove active class from all files
        document.querySelectorAll('.file-tree-file').forEach(file => {
            file.classList.remove('active');
        });

        // Add active class to current file
        const fileElement = document.querySelector(`[data-file="${filePath}"]`);
        if (fileElement) {
            fileElement.classList.add('active');
        }
    }

    showWelcomeScreen() {
        this.elements.welcomeScreen.style.display = 'flex';
        this.elements.codeEditor.style.display = 'none';
        
        // Clear file path
        this.elements.filePath.textContent = 'Select a file';
        
        // Reset status bar
        this.elements.fileType.textContent = '';
        this.elements.lineCount.textContent = '0 lines';
        this.elements.fileSize.textContent = '0 KB';

        this.currentFile = null;
        this.activeTab = null;
    }

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (this.sidebarCollapsed) {
            this.elements.sidebar.classList.add('collapsed');
            this.elements.sidebarToggle.querySelector('.toggle-icon').textContent = '›';
        } else {
            this.elements.sidebar.classList.remove('collapsed');
            this.elements.sidebarToggle.querySelector('.toggle-icon').textContent = '‹';
        }
    }

    setupMobileInterface() {
        // Add mobile file selector button to status bar on mobile
        if (window.innerWidth <= 768) {
            this.addMobileFileButton();
        }

        // Populate mobile file list
        this.populateMobileFileList();
    }

    addMobileFileButton() {
        if (!this.elements.statusBar) return;

        const mobileButton = document.createElement('button');
        mobileButton.className = 'status-item mobile-file-btn';
        mobileButton.textContent = '📁 Files';
        mobileButton.addEventListener('click', () => {
            this.showMobileSelector();
        });

        this.elements.statusBar.querySelector('.status-left').appendChild(mobileButton);
    }

    populateMobileFileList() {
        if (!this.elements.mobileFileList || !this.codeData) return;

        const files = Object.keys(this.codeData.files);
        const listHtml = files.map(filePath => {
            const fileName = filePath.split('/').pop();
            const fileIcon = this.getFileIcon(fileName);
            
            return `
                <div class="mobile-file-item" data-file="${filePath}">
                    <span class="file-icon">${fileIcon}</span>
                    <span class="file-name">${fileName}</span>
                    <span class="file-path">${filePath}</span>
                </div>
            `;
        }).join('');

        this.elements.mobileFileList.innerHTML = listHtml;

        // Add click listeners
        this.elements.mobileFileList.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.mobile-file-item');
            if (fileItem) {
                const filePath = fileItem.dataset.file;
                this.openFile(filePath);
                this.closeMobileSelector();
            }
        });
    }

    showMobileSelector() {
        if (this.elements.mobileFileSelector) {
            this.elements.mobileFileSelector.style.display = 'block';
        }
    }

    closeMobileSelector() {
        if (this.elements.mobileFileSelector) {
            this.elements.mobileFileSelector.style.display = 'none';
        }
    }

    setupMobileToggle() {
        // Add mobile menu toggle for sidebar
        const header = document.querySelector('.page-header');
        if (header && window.innerWidth <= 768) {
            const mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-sidebar-toggle';
            mobileToggle.innerHTML = '📁';
            mobileToggle.addEventListener('click', () => {
                this.elements.sidebar.classList.toggle('mobile-open');
            });
            
            header.appendChild(mobileToggle);
        }
    }

    async copyCurrentCode() {
        if (!this.currentFile || !this.codeData.files[this.currentFile]) {
            console.warn('⚠️ No code to copy');
            return;
        }

        try {
            const content = this.codeData.files[this.currentFile];
            await navigator.clipboard.writeText(content);
            
            // Show feedback
            const originalText = this.elements.copyCodeBtn.querySelector('.action-icon').textContent;
            this.elements.copyCodeBtn.querySelector('.action-icon').textContent = '✅';
            
            setTimeout(() => {
                this.elements.copyCodeBtn.querySelector('.action-icon').textContent = originalText;
            }, 2000);
            
            console.log('✅ Code copied to clipboard');
            
        } catch (error) {
            console.error('❌ Failed to copy code:', error);
            this.showError('Failed to copy code to clipboard');
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('vscode-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('❌ Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: Focus file tree
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const firstFile = document.querySelector('.file-tree-file');
            if (firstFile) firstFile.focus();
        }

        // Ctrl/Cmd + W: Close current tab
        if ((e.ctrlKey || e.metaKey) && e.key === 'w' && this.activeTab) {
            e.preventDefault();
            this.closeTab(this.activeTab);
        }

        // Ctrl/Cmd + C: Copy code
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && this.currentFile) {
            // Only if we're not in the code area (which has its own copy behavior)
            if (!e.target.closest('.code-content')) {
                e.preventDefault();
                this.copyCurrentCode();
            }
        }

        // Escape: Close mobile selector
        if (e.key === 'Escape') {
            this.closeMobileSelector();
        }
    }

    handleResize() {
        // Handle responsive behavior
        if (window.innerWidth <= 768) {
            this.elements.sidebar.classList.remove('mobile-open');
        }
    }

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const fileParam = urlParams.get('file');
        
        if (fileParam && this.codeData.files[fileParam]) {
            this.openFile(fileParam);
        }
    }

    updateURL(filePath) {
        const url = new URL(window.location);
        url.searchParams.set('file', filePath);
        window.history.replaceState({}, '', url.toString());
    }

    showLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'flex';
        }
        if (this.elements.interface) {
            this.elements.interface.style.display = 'none';
        }
    }

    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
        }
        if (this.elements.interface) {
            this.elements.interface.style.display = 'flex';
        }
    }

    showError(message) {
        console.error('💥 Code Viewer Error:', message);
        
        // Create error display
        const errorHtml = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>Something went wrong</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
        
        if (this.elements.welcomeScreen) {
            this.elements.welcomeScreen.innerHTML = errorHtml;
            this.elements.welcomeScreen.style.display = 'flex';
        }
    }
}

// Initialize the code viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Code Viewer...');
    new CodeViewer();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeViewer;
}