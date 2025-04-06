                    <div className="mb-2 mt-4 text-lg font-medium">
                      {t.curriculum.skills.Languages.map((language, index) => (
                        <span key={index}>
                          {language}{index < t.curriculum.skills.Languages.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div> 