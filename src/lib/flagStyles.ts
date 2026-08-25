export const CRITICAL_FLAGS = ['Hypertensive Crisis', 'Low', 'High', 'Stage 2 High'];
export const WARNING_FLAGS = ['Stage 1 High', 'Elevated'];

export function getFlagClasses(flag?: string): string {
  switch (flag) {
    case 'Hypertensive Crisis':
      return 'bg-gradient-to-r from-red-600 to-red-700 text-white';
    case 'Low':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    case 'Stage 2 High':
    case 'High':
      return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
    case 'Stage 1 High':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    case 'Elevated':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#4A3A33]';
    default:
      return '';
  }
}
