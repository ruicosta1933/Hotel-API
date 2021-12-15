function QuartoService(QuartoModel) {

    const ITEMS_PER_PAGE = 2;

    let service = {
        create,
        save,
        findAll,
        findById,
        update,
        removeById,
    };

    function create(values){
        let newQuarto = QuartoModel(values);
        return save(newQuarto);
    }

    function save(newQuarto){
        return new Promise(function (resolve, reject){
            newQuarto.save(function(err){
                if (err) reject(err);

                resolve('Quarto adicionado!');
            });
        });
    }

    function findById(id){
        return new Promise(function(resolve,reject){
            QuartoModel.findById(id,  function (err, quartos){
                if (err) reject (err);
                resolve(quartos); 
            });
        });
    }

    function update(id,values){
        return new Promise(function(resolve,reject){
            QuartoModel.findByIdAndUpdate(id,values, {new: true}, function(err,quarto){
                if(err) reject(err);

                resolve(quarto);
            });
        });
    }

    function removeById(id){
        return new Promise(function(resolve,reject){
                console.log(id);
                QuartoModel.findByIdAndRemove(id,function(err){
                    console.log(err);
                    if(err) reject(err);
                    resolve();
                });
            });
    }

    function findAll(req){
        const {page = 1} = req.query;
        return new Promise(function(resolve,reject){
        
            QuartoModel.find({}, function (err,quartos){
                if(err) reject(err);
                resolve(quartos);
            })
            .limit(ITEMS_PER_PAGE)
            .skip((page-1) * ITEMS_PER_PAGE)
            .sort([[req.query.orderBy, req.query.direction]]);
        });
    }
 

    return service;
}

module.exports = QuartoService;