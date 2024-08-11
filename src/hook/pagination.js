export function generatePagination(activePage, totalPages) {
    if (activePage <= 0 || totalPages <= 0 || activePage > totalPages) {
        return []; // Invalid input scenario
    }

    const result = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            if (i !== totalPages) {
                result.push(i);
            }
        }
    } else {
        let start = 1;
        const rem = totalPages - activePage;
        if (rem < 6) {
            start = totalPages - 6;
        }
        else {
            start = activePage < 3 ? 1 : activePage - 2
        }
        const end = Math.min(start + 5, totalPages);
        for (let i = start; i <= end; i++) {
            if (i !== totalPages) {
                result.push(i);
            }
        }
    }

    return result;
}