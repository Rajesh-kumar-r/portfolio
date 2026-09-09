import { describe, it, expect } from 'vitest';
import { dispatch } from '../src/components/Terminal/commands';
import { PROJECTS, CONTACT } from '../src/data/resume';

const ctx = () => ({ history: [] as string[] });

describe('dispatch (pure command core)', () => {
  it('echoes the command as the first line', () => {
    const { lines } = dispatch('help', ctx());
    expect(lines[0]).toEqual({ text: 'rajesh@portfolio $ help', color: 'var(--color-accent-300)' });
  });
  it('help lists the info commands', () => {
    const text = dispatch('help', ctx()).lines.map(l => l.text).join('\n');
    expect(text).toContain('projects');
    expect(text).toContain('skills');
    expect(text).toContain('contact');
    expect(text.toLowerCase()).toContain('not everything is listed');
  });
  it('projects with no arg lists all four generic titles', () => {
    const text = dispatch('projects', ctx()).lines.map(l => l.text).join('\n');
    for (const p of PROJECTS) expect(text).toContain(p.title);
  });
  it('projects 3 shows detail + tech stack for the third', () => {
    const text = dispatch('projects 3', ctx()).lines.map(l => l.text).join('\n');
    expect(text).toContain(PROJECTS[2].title);
    expect(text).toContain('Tech Stack:');
    expect(text).toContain(PROJECTS[2].tech[0]);
  });
  it('work and ls alias projects', () => {
    expect(dispatch('work', ctx()).lines.length).toBe(dispatch('projects', ctx()).lines.length);
    expect(dispatch('ls', ctx()).lines.length).toBe(dispatch('projects', ctx()).lines.length);
  });
  it('contact prints all three channels', () => {
    const text = dispatch('contact', ctx()).lines.map(l => l.text).join('\n');
    expect(text).toContain(CONTACT.email);
    expect(text).toContain('linkedin.com/in/rajesh-kumar-kgm');
    expect(text).toContain('github.com/Rajesh-kumar-r');
  });
  it('resume prints the download + preview URLs', () => {
    const text = dispatch('resume', ctx()).lines.map(l => l.text).join('\n');
    expect(text).toContain('drive.google.com/uc?export=download&id=1VpeIoEdmAS35GmrbecjeIYukmQBNvXJG');
    expect(text).toContain('/preview');
  });
  it('sudo and exit have their easter-egg replies', () => {
    expect(dispatch('sudo', ctx()).lines.map(l => l.text).join(' ')).toContain('nice try.');
    expect(dispatch('q', ctx()).lines.map(l => l.text).join(' ')).toContain('scroll instead');
  });
  it('clear returns the clear tag and no output lines beyond echo', () => {
    expect(dispatch('clear', ctx()).handled).toBe('clear');
  });
  it('games is disabled in this build', () => {
    const r = dispatch('games', ctx());
    expect(r.handled).toBe('normal');
    expect(r.lines.map(l => l.text).join(' ')).toContain('no arcade in this build');
  });
  it('echo / pwd / date basic commands', () => {
    expect(dispatch('echo hi there', ctx()).lines.map(l => l.text)).toContain('hi there');
    expect(dispatch('pwd', ctx()).lines.map(l => l.text).join('')).toContain('/home/rajesh');
  });
  it('hack returns the scripted lines and the hack tag', () => {
    const r = dispatch('hack', ctx());
    expect(r.handled).toBe('hack');
    expect(r.lines.map(l => l.text).join('\n')).toContain('ACCESS GRANTED');
    expect(r.lines.map(l => l.text).join('\n')).toContain('Raspberry Pi under the desk');
  });
  it('unknown command is an error line', () => {
    const r = dispatch('florb', ctx());
    expect(r.handled).toBe('normal');
    const last = r.lines.find(l => l.text.includes('command not found'))!;
    expect(last.color).toBe('var(--color-accent-2-400)');
    expect(last.text).toBe('florb: command not found. try help');
  });
});
