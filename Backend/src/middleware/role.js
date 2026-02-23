'use strict';

/**
 * Role-based access control middleware factory.
 * Usage: authorize('admin') or authorize('admin', 'manager')
 */
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthenticated.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access forbidden. Required role: ${allowedRoles.join(' or ')}.`,
            });
        }

        next();
    };
}

module.exports = { authorize };
