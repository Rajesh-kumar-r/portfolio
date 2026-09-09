import { describe, it, expect } from 'vitest';
import { STATS, ABOUT, PROJECTS, SKILLS, ROLES, NOW, CONTACT, EXPERIENCE_META } from '../src/data/resume';

describe('resume data', () => {
  it('has the four stats with exact values', () => {
    expect(STATS.map(s => s.value)).toEqual(['7+', '1L+', '15+', '35%']);
    expect(STATS.map(s => s.label)).toEqual([
      'Years shipping', 'Users served', 'Tenants, one system', 'Faster publishing',
    ]);
  });
  it('has 4 projects with generic titles and no product names', () => {
    expect(PROJECTS).toHaveLength(4);
    expect(PROJECTS.map(p => p.title)).toEqual([
      'CRM-based Web Application',
      'CMS-based Web Application',
      'Incentive Management & Rebate Optimization Platform',
      'Authenticated Dashboard Application',
    ]);
    const blob = JSON.stringify(PROJECTS);
    for (const name of ['GetGist', 'Organyz', 'JoinBand', 'DA Link']) {
      expect(blob).not.toContain(name);
    }
    expect(PROJECTS[0].no).toBe('01');
    expect(PROJECTS[1].body).toContain('cutting content publishing time by 35%');
  });
  it('has 6 skill groups in artboard order', () => {
    expect(SKILLS.map(g => g.label)).toEqual([
      'Frontend', 'Frameworks / Libraries', 'Backend',
      'AI-Assisted Development', 'DevOps', 'Project Management / VCS',
    ]);
    expect(SKILLS[1].items).toContain('Redux-Saga');
  });
  it('has 4 roles newest-first', () => {
    expect(ROLES).toHaveLength(4);
    expect(ROLES[0]).toMatchObject({ when: 'Apr 2022 — Present', span: '4 yrs 6 mos', title: 'Senior Developer', mode: 'Full-time · Hybrid' });
    expect(ROLES[3].title).toBe('Frontend Web Developer');
  });
  it('carries the about + now + contact + experience copy', () => {
    expect(ABOUT.lead).toContain('the unglamorous parts');
    expect(ABOUT.paras).toHaveLength(2);
    expect(NOW.lead).toContain('performance is a feature, not a ticket');
    expect(CONTACT).toEqual({
      email: 'rajeshkumarrkgm@gmail.com',
      linkedin: 'https://www.linkedin.com/in/rajesh-kumar-kgm',
      github: 'https://github.com/Rajesh-kumar-r',
    });
    expect(EXPERIENCE_META).toEqual({
      company: 'Mallow Technologies Private Limited',
      total: '7 yrs 8 mos',
      location: 'Karur, Tamil Nadu, India',
    });
  });
});
