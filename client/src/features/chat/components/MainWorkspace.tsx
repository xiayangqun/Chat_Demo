import { Routes, Route } from 'react-router-dom';
import { ChatWorkspace } from './ChatWorkspace';
import { MembersPage } from './MembersPage';

export function MainWorkspace() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Routes>
        <Route path="/" element={<ChatWorkspace />} />
        <Route path="/members" element={<MembersPage />} />
      </Routes>
    </div>
  );
}
