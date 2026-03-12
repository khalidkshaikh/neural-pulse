import { getSAPUpdates } from '@/lib/getData';
import SAPAIClient from './SAPAIClient';

export default function SAPAIPage() {
  const sapUpdates = getSAPUpdates();
  return <SAPAIClient sapUpdates={sapUpdates} />;
}
