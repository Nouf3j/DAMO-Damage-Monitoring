import User from '../models/User.js';
import jwt from 'jsonwebtoken'

// دالة تسجيل الدخول
const login = async (req, res, next) => {
  try {
    const { idNumber, password } = req.body;

    // التحقق من البيانات المدخلة
    if (!idNumber || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'يجب إدخال رقم الهوية وكلمة المرور' 
      });
    }

    if (idNumber.length !== 10) {
      return res.status(400).json({ 
        success: false, 
        error: 'رقم الهوية يجب أن يكون 10 أرقام' 
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ idNumber }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'بيانات الدخول غير صحيحة' 
      });
    }

    // التحقق من كلمة المرور
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'بيانات الدخول غير صحيحة' 
      });
    }

    // إنشاء توكن
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        idNumber: user.idNumber
      }
    });

  } catch (error) {
res.status(500).json({
      success: false,
      error: error.message
    });  }
};

// دالة التسجيل
const register = async (req, res, next) => {
  try {
    const { idNumber, password } = req.body;

    // 1. التحقق من البيانات المدخلة
    if (!idNumber || !password) {
      return res.status(400).json({
        success: false,
        error: 'يجب إدخال رقم الهوية وكلمة المرور'
      });
    }

    // 2. التحقق من صحة رقم الهوية (10 أرقام)
    if (idNumber.length !== 10 || !/^\d+$/.test(idNumber)) {
      return res.status(400).json({
        success: false,
        error: 'رقم الهوية يجب أن يتكون من 10 أرقام فقط'
      });
    }

    // 3. التحقق من قوة كلمة المرور (اختياري)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      });
    }

    // 4. التحقق من عدم وجود مستخدم مسجل بنفس رقم الهوية
    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'رقم الهوية مسجل مسبقاً'
      });
    }

    // 5. إنشاء المستخدم الجديد (كلمة المرور تُهش تلقائياً بفضل middleware في نموذج User)
    const user = await User.create({ idNumber, password });

    // 6. إنشاء توكن الدخول
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    // 7. إرجاع البيانات الناجحة (بدون إرجاع كلمة المرور)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        idNumber: user.idNumber,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    // 8. معالجة الأخطاء غير المتوقعة
    console.error('Registration error:', error);
    
    // إذا كان الخطأ من mongoose (مثل validation error)
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(el => el.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    next(error);
  }
};

// تصدير الدوال
export { login, register };  