import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import evaluatex from 'evaluatex/dist/evaluatex';

interface EvaluatexSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: EvaluatexSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: EvaluatexSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Evaluatex Active');

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			hotkeys: [{ modifiers: ["Mod"], key: "j" }],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// console.log(editor.getSelection());
				// editor.replaceSelection('Sample Editor Command');
				let selectedText = editor.getSelection();
				let fn = evaluatex(selectedText);
				let result = fn();
				editor.replaceSelection(result.toString());
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new EvaluatexSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class EvaluatexSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for mevaluatex plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
