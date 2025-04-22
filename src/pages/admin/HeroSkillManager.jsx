import { useEffect, useState } from "react";

const HeroSkillManager = () => {
  const [heroSkills, setHeroSkills] = useState([]);
  const [formData, setFormData] = useState({
    hero_id: "",
    skill_id: "",
    level: "",
  });

  const fetchHeroSkills = async () => {
    try {
      const res = await fetch(
        "http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/hero_skills/get-hero-skills.php"
      );
      const data = await res.json();
      setHeroSkills(data);
    } catch (error) {
      console.error("Error fetching hero skills:", error);
    }
  };

  useEffect(() => {
    fetchHeroSkills();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        "http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/hero_skills/add-hero-skill.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      setFormData({ hero_id: "", skill_id: "", level: "" });
      fetchHeroSkills();
    } catch (error) {
      console.error("Error adding hero skill:", error);
    }
  };

  const handleUpdate = async (hero_id, skill_id, newLevel) => {
    try {
      await fetch(
        "http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/hero_skills/update-hero-skill.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero_id, skill_id, level: newLevel }),
        }
      );
      fetchHeroSkills();
    } catch (error) {
      console.error("Error updating skill level:", error);
    }
  };

  const handleDelete = async (hero_id, skill_id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kỹ năng này?")) return;
    try {
      await fetch(
        "http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/hero_skills/delete-hero-skill.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero_id, skill_id }),
        }
      );
      fetchHeroSkills();
    } catch (error) {
      console.error("Error deleting hero skill:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý Hero Skills</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="number"
          name="hero_id"
          placeholder="Hero ID"
          value={formData.hero_id}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="skill_id"
          placeholder="Skill ID"
          value={formData.skill_id}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="level"
          placeholder="Level"
          value={formData.level}
          onChange={handleChange}
          required
        />
        <button type="submit">Thêm kỹ năng</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Hero ID</th>
            <th>Skill ID</th>
            <th>Level</th>
            <th>Cập nhật</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {heroSkills.map((skill) => (
            <tr key={`${skill.hero_id}-${skill.skill_id}`}>
              <td>{skill.hero_id}</td>
              <td>{skill.skill_id}</td>
              <td>
                <input
                  type="number"
                  defaultValue={skill.level}
                  onBlur={(e) =>
                    handleUpdate(
                      skill.hero_id,
                      skill.skill_id,
                      parseInt(e.target.value)
                    )
                  }
                />
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUpdate(
                      skill.hero_id,
                      skill.skill_id,
                      parseInt(skill.level)
                    )
                  }
                >
                  Lưu
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleDelete(skill.hero_id, skill.skill_id)
                  }
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeroSkillManager;
